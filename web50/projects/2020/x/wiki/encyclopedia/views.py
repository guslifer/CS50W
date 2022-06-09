from django.shortcuts import render
from django.urls import reverse
from . import util
from django.http import HttpResponse, HttpResponseNotFound,HttpResponseRedirect


def index(request):
    
    if(request.method == 'POST'):
        to_search = request.POST["q"]
        #if find exatcly the content that is searching, render the article using the urls pattern 
        #else exibits the nearest result
        if(util.get_entry(to_search)):
            return HttpResponseRedirect(reverse('encyclopedia:article', kwargs= {'title':to_search}))
        else:
            temp = util.list_entries()
            results = [results for results in temp if to_search in results.lower()]
            return render(request, "encyclopedia/result.html", {'results': results})
                    
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })
    
def title(request, title):
    
    entry = util.get_entry(title)
    #if there is no entries returns 404
    #else render the article content
    if(entry == None):
        return HttpResponseNotFound("<h1> 404 - Page not found </h1")
    else:
        return render(request, "encyclopedia/title.html", {
            "entry": entry , "title": title
        })

def result(request):
    return HttpResponseNotFound("<h1> 404 - Page not found </h1")
    

