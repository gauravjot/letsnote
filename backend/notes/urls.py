from django.urls import path
from .views import createNote, myNotes, noteOps

urlpatterns = [
    path('api/note/all/', myNotes),
    path('api/note/create/', createNote),
    path('api/note/<noteid>/', noteOps),
    path('api/note/<noteid>/', noteOps),
    path('api/note/<noteid>/', noteOps),
]