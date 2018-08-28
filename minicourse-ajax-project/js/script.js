
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
	var $wikiHeader = $('#wikipedia-header');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
	/* 
		Thanks for registering for a New York Times API Key.
		Here's your API Key: 40ec3f79f6844a7ab46f88d2bae47956
	*/
	
    // load street view from Google Maps API
 
    let streetInput = $("#street").val();
	let cityInput = $("#city").val();
	let address = streetInput + ", " + cityInput;

	let googleAPIURL = "<img class = 'bgimg' src = ' https://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + address + "'>"
	
	$body.append(googleAPIURL);

	let linksAndSnippets= [];
	let content, mainHeadline, linkToArticle, articleSnippet;
	let nyTimesAPI = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=40ec3f79f6844a7ab46f88d2bae47956&sort=newest&q=" + cityInput +""
	
	// Ajax request for NY Times
	$.getJSON(nyTimesAPI, function (data) 
	{
		let docsArray = data.response.docs; //"docs" is an array of objects
		for (let i = 0; i < docsArray.length; i++)
			{
				content = docsArray[i];
				mainHeadline = content.headline.main;
				linkToArticle = content.web_url;
				articleSnippet = content.snippet;
				linksAndSnippets.push("<li class = 'article'><a href = '"+ linkToArticle + "' target = '_blank'>" + mainHeadline + "</a>");
				linksAndSnippets.push("<p>" + articleSnippet + "</p>");
				linksAndSnippets.push("</li>");
			}
			linksAndSnippets.join("");
			$nytHeaderElem.text("New York Times Articles About " + cityInput);
			$nytElem.append(linksAndSnippets);
	}).error(function()
	{
		$nytHeaderElem.text("No articles found");
	});
		/*
		Another, more deeply nested way of doing it; Don't do this! Confusing & inefficient; equivalent to double for loops
		$.each(docsArray, function (index, objValue) //loop thru each object in array
		{
			content = objValue;
			mainHeadline = content.headline.main;
 			$.each(content, function (key, val)
			{			
				if (key === "web_url")
				{					
					linksAndSnippets.push("<li class = 'article'>");
					linksAndSnippets.push("<a href = '"+ val + "' target = '_blank'>" + mainHeadline + "</a>");
				}
				if (key === "snippet")
				{
					linksAndSnippets.push("<p>" + val + "</p>");
					linksAndSnippets.push("</li>");
				}
				
			}); 
		});
		*/

		/* 
		MANUAL, painful way to get keys in JSON using if statements instead of dot notion. But may be safer for null pointer?
		$.each(data, function(key, value)
		{
			let firstKey = key;
			let firstValue = value;
			if (firstKey === "response") //got pass 1st layer, value = object of docs, meta
			{
				//console.log(firstValue); 				
				$.each(firstValue, function(key, value)
				{
					let secondKey = key;
					let secValue = value;
					if (secondKey === "docs")
					{
						//console.log(secValue);
					}
				});
			}			
		});
		*/
	
	// Ajax request for Wikipedia
	// NOTE - do not use 'jsonfm' as parameter for format; does NOT work. Just use 'json'
	let wikiURL = "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&searchdsfsdfds="+ cityInput + "";
	
	//After 10 seconds, displays back error message. This func runs no matter what, that's why need to call the negation function clearTimeout under 'success'
	let wikiTimeOut = setTimeout(function() 
	{
		$wikiHeader.text("Unable to Load Wikipedia Articles");
	}, 5000); 
	
	$.ajax(
	{
		url: wikiURL,
		dataType: "jsonp",
		success: function (response)
		{
			let resultArray = response[1];
			let linkArray = response[3];
			let linksAndContent = [];
			for (let i = 0; i < resultArray.length; i++)
			{
				linksAndContent.push("<li><a href ='" + linkArray[i] + "' target ='_blank'>" + resultArray[i] + "</a></li>" );
			}
			linksAndContent.join("");
			$wikiHeader.text("Relevant Wikipedia Links About " + cityInput);
			$wikiElem.append(linksAndContent);
			clearTimeout(wikiTimeOut); //if successful then negate setTimeout function above
		}
	})

	return false;
};

$('#form-container').submit(loadData);
