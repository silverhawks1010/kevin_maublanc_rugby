from django.views.generic import TemplateView


class MobileView(TemplateView):
    template_name = "mobile.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["organisateur"] = "RTC Comitee"

        return context
 