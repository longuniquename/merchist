(function () {
    var wf = document.createElement('link');
    wf.href = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic';
    wf.type = 'text/css';
    wf.rel = 'stylesheet';
    var l = document.getElementsByTagName('link')[0];
    l.parentNode.insertBefore(wf, l);
})();
