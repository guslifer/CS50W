from django.shortcuts import redirect, render
from django.urls import reverse
from . import util
from django.http import HttpResponse, HttpResponseNotFound,HttpResponseRedirect, HttpResponseBadRequest


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

def newpage(request):
    if(request.method == "POST"):
        #test if the user send an name and an article writed
        if(len(request.POST["articletext"]) > 0 and len(request.POST["name"]) > 0):
            name = request.POST["name"]
            article = request.POST["articletext"]
            entries = util.list_entries()
            entries_lower = [temp.lower() for temp in entries]
            if(name.lower() in entries_lower):
                return HttpResponseBadRequest("Bad request, Bro")
            else:
                util.save_entry(name, article)
                return redirect(reverse('encyclopedia:article', kwargs= {'title':name}))
            
    
    return render(request, "encyclopedia/newpage.html")
    

