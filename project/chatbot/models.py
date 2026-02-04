from django.db import models

class ChatMessage(models.Model):
    """
    Stores every conversation between users and Williams
    SQL database table for chat history
    """
    question = models.TextField()  # User's question
    response = models.TextField()  # Williams' answer
    latitude = models.FloatField(null=True, blank=True)  # User location
    longitude = models.FloatField(null=True, blank=True)  # User location
    timestamp = models.DateTimeField(auto_now_add=True)  # When the chat happened

    class Meta:
        ordering = ['-timestamp']  # Newest first (SQL: ORDER BY timestamp DESC)

    def __str__(self):
        return f"Chat at {self.timestamp}: {self.question[:50]}..."
