from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.core import serializers
import json

from .models import Event, Stadium, Team, Ticket

def api():
    data = serializers.serialize("json", Ticket.objects.all())
    return JsonResponse(json.loads(data), safe=False)

def api_events(request):
    data = serializers.serialize("json", Event.objects.all())
    return JsonResponse(json.loads(data), safe=False)

def api_stadiums(request):
    data = serializers.serialize("json", Stadium.objects.all())
    return JsonResponse(json.loads(data), safe=False)

def api_teams(request):
    data = serializers.serialize("json", Team.objects.all())
    return JsonResponse(json.loads(data), safe=False)

def api_ticket(request, pk):
    data = serializers.serialize("json", Ticket.objects.filter(pk=pk))
    return JsonResponse(json.loads(data), safe=False)