from django.db import models
from django.contrib.auth.models import User

class Generation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='generations')
    prompt = models.TextField()
    image_url = models.URLField(blank=True, null=True)  # will store the mock URL
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.prompt[:50]}"