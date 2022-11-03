from django.urls import path
from .views import updateNote, createNote, readNote, deleteNote, myNotes

urlpatterns = [
    path('api/note/update/<noteid>/', updateNote),
    path('api/note/create/', createNote),
    path('api/note/delete/<noteid>', deleteNote),
    path('api/note/read/<noteid>/', readNote),
    path('api/note/all/', myNotes),
]