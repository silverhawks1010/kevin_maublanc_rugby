from django.urls import path
# Import des URLs de l'interface d'administration
from django.contrib import admin
# Import des vues qui sont déclarées dans leur propre module (dossier)
from .views import HomeView, StadiumsView, TeamsView, NewsletterView, UpdateView, AboutView, MobileView, QrCode
from .api import api, api_get, api_ticket

urlpatterns = (
    path("", HomeView.as_view(), name="home"),
    path("stadiums/", StadiumsView.as_view(), name="stadiums"),
    path("teams/", TeamsView.as_view(), name="teams"),
    path("newsletter/", NewsletterView.as_view(), name="newsletter"),
    path("update/", UpdateView.as_view(), name="update"),
    path("about/", AboutView.as_view(), name="about"),
    path("mobile/", MobileView.as_view(), name="mobile"),
    path("scan/", QrCode.as_view(), name="qrcode"),


    path("api/", api, name="api"),
    path("api/<str:pk>/", api_get, name="api_get"),
    path("api/ticket/<str:pk>/", api_ticket, name="api_ticket"),


    path("vfjifjsoldijfdsjfdjsdfdsjvhsjvisjhusdvhdsi", admin.site.urls),
)
