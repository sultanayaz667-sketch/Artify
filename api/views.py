import time
import requests
import traceback
from decouple import config
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .models import Generation
from .serializers import GenerationSerializer

def test_api(request):
    return JsonResponse({'message': 'Hello from Django!'})

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GenerateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        prompt = request.data.get('prompt')
        if not prompt:
            return Response({'error': 'Prompt is required'}, status=400)

        api_key = config('HORDE_API_KEY', default='YOUR_API_KEY_HERE')
        if api_key == 'YOUR_API_KEY_HERE':
            return Response({'error': 'Please set your HORDE_API_KEY in .env file'}, status=500)

        try:
            print(f"1. Prompt received: {prompt}")
            submit_url = "https://stablehorde.net/api/v2/generate/async"
            payload = {
                "prompt": prompt,
                "params": {
                    "width": 512,
                    "height": 512,
                    "sampler_name": "k_lms",
                    "cfg_scale": 7.5,
                    "steps": 30,
                    "n": 1
                },
                "nsfw": False,
                "trusted_workers": False,
                "models": ["stable_diffusion"]
            }
            headers = {
                "Content-Type": "application/json",
                "apikey": api_key
            }

            print("2. Submitting job to Horde...")
            submit_response = requests.post(submit_url, json=payload, headers=headers, timeout=10)
            print(f"3. Submit response status: {submit_response.status_code}")
            print(f"3a. Submit response text: {submit_response.text}")

            if submit_response.status_code != 202:
                error_detail = submit_response.text if submit_response.text else "Unknown error"
                return Response({'error': f'Horde submission failed: {error_detail}'}, status=500)

            job_data = submit_response.json()
            job_id = job_data.get('id')
            if not job_id:
                return Response({'error': 'No job ID returned'}, status=500)

            print(f"4. Job ID: {job_id}")

            status_url = f"https://stablehorde.net/api/v2/generate/status/{job_id}"
            max_attempts = 60
            image_url = None

            for attempt in range(max_attempts):
                print(f"5. Polling attempt {attempt+1}")
                time.sleep(1)
                try:
                    status_response = requests.get(status_url, timeout=5)
                    if status_response.status_code != 200:
                        continue
                    status_data = status_response.json()
                    if status_data.get('done'):
                        generations = status_data.get('generations')
                        if generations and len(generations) > 0:
                            image_url = generations[0].get('img')
                            if image_url:
                                print(f"6. Image URL received: {image_url}")
                                break
                except Exception as e:
                    print(f"Polling error: {e}")
                    continue
            else:
                return Response({'error': 'Image generation timed out'}, status=500)

            generation = Generation.objects.create(
                user=request.user,
                prompt=prompt,
                image_url=image_url
            )

            serializer = GenerationSerializer(generation)
            return Response(serializer.data, status=201)

        except Exception as e:
            print("!!! ERROR in generate view !!!")
            traceback.print_exc()
            return Response({'error': str(e)}, status=500)

class HistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        generations = request.user.generations.all().order_by('-created_at')
        serializer = GenerationSerializer(generations, many=True)
        return Response(serializer.data)

# New Delete View
class DeleteGenerationView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, generation_id):
        try:
            generation = Generation.objects.get(id=generation_id, user=request.user)
            generation.delete()
            return Response({'message': 'Deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Generation.DoesNotExist:
            return Response({'error': 'Generation not found'}, status=status.HTTP_404_NOT_FOUND)