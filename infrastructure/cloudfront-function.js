function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Don't redirect static files (robots.txt, sitemap.xml, etc.)
    if (uri === '/robots.txt' || uri === '/sitemap.xml' || uri.match(/\.(txt|xml|json|ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot)$/)) {
        return request;
    }
    
    // Handle directory requests (like /ru, /uk) - append index.html
    // Only if the request doesn't already end with .html
    if ((uri === '/uk' || uri === '/ru') && !uri.endsWith('.html')) {
        request.uri = uri + '/index.html';
        return request;
    }
    
    // Handle subdirectory requests (like /ru/st130) - append index.html if no file extension
    if (uri.match(/^\/(uk|ru)\/[^\/]*$/) && !uri.endsWith('.html') && !uri.includes('.')) {
        request.uri = uri + '/index.html';
        return request;
    }
    
    // Return the original request if no changes needed
    return request;
}
