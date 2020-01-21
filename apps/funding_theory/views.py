from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index_view(request, *args, **kwargs):
	return render(request, "funding_theory/index.html", {})

def cactus_plot_view(request, *args, **kwargs):
	return render(request, "funding_theory/cactus_plot.html", {})