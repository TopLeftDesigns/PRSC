{% assign seperator = "%%%" %}

{module_webappsresults render="collection" hideEmptyMessage="False" resultsPerPage="500" collection="searchResults" template="" }

{% comment %} Get the user supplied templatem or use the default one if none provided {% endcomment %}
{% assign rg-TemplateSize = rg-Template | size %}
{% unless rg-TemplateSize > 0 %}
	{% assign rg-Template = searchResults.moduleDescriptor.templatePath -%}
{% endunless %}


{% comment %} If reversed is not set by the user to true, make it default to false {% endcomment %}
{% unless rg-Reversed %}
	{% assign rg-Reversed = false %}
{% endunless %}

{% comment %} If no group field is provided, default to the name field {% endcomment %}
{% assign rg-resultsGroupSize = rg-GroupBy | size %}
{% unless rg-resultsGroupSize > 0 %}
	{% assign rg-GroupBy = "Name" %}
{% endunless %}

{% comment %} If no spacer for the group header is provided, default to a space {% endcomment %}
{% unless rg-GroupByHeadingSpacer %}
	{% assign rg-GroupByHeadingSpacer = " " %}
{% endunless %}




{% comment %} Handle spaces in the array before or after field names {% endcomment %}
{% if rg-GroupBy %}
	{% assign rg-GroupBy = rg-GroupBy | replace: " ,", "," %}
	{% assign rg-GroupBy = rg-GroupBy | replace: "  ,", "," %}
	{% assign rg-GroupBy = rg-GroupBy | replace: ", ", "," %}
	{% assign rg-GroupBy = rg-GroupBy | replace: ",  ", "," %}
{% endif %}


{% comment %} Collect the groupby fields provided by the user and process them {% endcomment %}
{% if rg-GroupBy %}
	{% assign rg-GroupBy = rg-GroupBy | split: ',' %}
	{% assign rg-GroupBySize = rg-GroupBy | size %}
{% endif %}

{% if rg-GroupBySize > 0 %}
	{% assign rg-GroupBy0 = rg-GroupBy[0] %}
{% endif %}

{% if rg-GroupBySize > 1 %}
	{% assign rg-GroupBy1 = rg-GroupBy[1] %}
{% endif %}

{% if rg-GroupBySize > 2 %}
	{% assign rg-GroupBy2 = rg-GroupBy[2] %}
{% endif %}



{% assign allItems = "" %}
{% for item in searchResults.items %}
	{% if item.[rg-GroupBy] == "" %}
		{% assign groupValue = "_____" %}

	{% else %}
        {% case rg-GroupBySize %}
            {% when 1 %}
				{% assign rg-groupByString0 = item.[rg-GroupBy0] | date: rg-GroupByDateFormat | convert: "date" %}
				{% assign groupValue = rg-groupByString0 %}
            {% when 2 %}
				{% assign rg-groupByString0 = item.[rg-GroupBy0] | date: rg-GroupByDateFormat | convert: "string" %}
				{% assign rg-groupByString1 = item.[rg-GroupBy1] | date: rg-GroupByDateFormat | convert: "string" %}
				{% assign groupValue = rg-groupByString0 | append: rg-GroupByHeadingSpacer | append: rg-groupByString1 %}
            {% when 3 %}
                {% assign rg-groupByString0 = item.[rg-GroupBy0] | date: rg-GroupByDateFormat | convert: "string" %}
				{% assign rg-groupByString1 = item.[rg-GroupBy1] | date: rg-GroupByDateFormat | convert: "string" %}
				{% assign rg-groupByString2 = item.[rg-GroupBy2] | date: rg-GroupByDateFormat | convert: "string" %}
				{% assign groupValue = rg-groupByString0 | append: rg-GroupByHeadingSpacer | append: rg-groupByString1 | append: rg-GroupByHeadingSpacer | append: rg-groupByString2 %}
            {% else %}
                {% assign groupValue = item.Name %}
        {% endcase %}
	
	{% endif %}

	{% assign allItems = allItems | convert: "string" | append: groupValue | append: "*" | append: item.itemid %}
	
	{% unless forloop.last %}
		{% assign allItems = allItems | append: {{seperator}} %}
	{% endunless %}

{% endfor %}


{% assign allItems = allItems | split: {{seperator}} | sort %}

{% assign previousItem = "" %}
{% assign groupedItems = "" %}

{% comment -%} Loop thru all result items. {% endcomment -%}

{% comment -%} If the reversed variable has been set to true by the user {% endcomment -%}
{% if rg-Reversed %}
    {% for item in allItems reversed %}
        {% assign outputGroupItems = false -%}
		{% assign doesNotMatch = false -%}
        {% comment -%} Divide the item into group type and item id {% endcomment -%}
        {% assign thisItem = item | split: "*" %}

		{% comment -%} Is this the 1st item? {% endcomment -%}
        {% if forloop.first %}
            {% comment -%} Don't render module. Set up for next loop {% endcomment -%}
            {% assign groupedItems = item %}
            {% assign previousItem = thisItem[0] %}
            {% if forloop.last %}
				{% assign outputGroupItems = true -%}
            {% endif %}
        {% else -%}
            {% comment -%} DOES NOT MATCH PREVIOUS ITEM. Setup to output previous group. {% endcomment -%}
            {% if thisItem[0] != previousItem -%}
                {% assign outputGroupItems = true -%}
				{% assign doesNotMatch = true -%}
        
			{% comment -%} MATCHES PREVIOUS ITEM. Unless last item, don't output yet. {% endcomment -%}
            {% else -%}
                {% comment -%} Append this item to rest of items in group (via string) {% endcomment -%}
                {% assign groupedItems = groupedItems | append: {{seperator}} | append: item -%}
                {% comment %} Last Item? Output current group. {% endcomment -%}
                {% if forloop.last -%}
                    {% assign outputGroupItems = true -%}
					
                {% endif -%}
            {% endif -%}

        {% endif -%}
        
        {% comment -%} OUTPUT PREVIOUS GROUP {% endcomment -%}

		{% if outputGroupItems -%}
            
            {% comment %} BEFORE GROUP {% endcomment -%}
            {% if beforegroup %}{{ beforegroup }}{% endif -%}
            
            {% comment %} Create an array with all of the items in previous group. {% endcomment %}
            {% assign groupedItemsArray = groupedItems | split: {{seperator}} | sort %}
            
            {% comment -%} OUTPUT PREVIOUS GROUP {% endcomment -%}
			{% if {{rg-GroupByHeading}} %}
				<{{rg-GroupByHeading}}>{% if rg-GroupByHeadingPrefix %}{{rg-GroupByHeadingPrefix}}{% endif %} {{previousItem}}</{{rg-GroupByHeading}}>
			{% endif %}
            {% for groupedItem in groupedItemsArray reversed %}
                {% assign thisGroupedItem = groupedItem | split: "*" %}
				
                {module_webapps id="{{globals.get.CCID}}" filter="item" itemid="{{thisGroupedItem[1]}}" collection="test" template="{{rg-Template}}" }
            {% endfor %}
            
            {% comment %} AFTER GROUP {% endcomment %}
            {% if aftergroup %}{{ aftergroup }}{% endif %}
                
            {% comment -%} Reset groupedItem string. {% endcomment -%}
            {% assign groupedItems = item -%}
            
        {% endif -%}
        
        {% comment %} Set the previous item as this item, to make calculations next round. {% endcomment %}
        {% assign previousItem = thisItem[0] %}
		
		{% comment %} If this is the last item in the for loop, output it before leaving the loop {% endcomment %}
		{% if forloop.last -%}	

			{% comment %} BEFORE GROUP {% endcomment -%}
            {% if beforegroup %}{{ beforegroup }}{% endif -%}
            
            {% comment %} Create an array with all of the items in previous group. {% endcomment %}
            {% assign groupedItemsArray = groupedItems | split: {{seperator}} | sort %}
            
            {% comment -%} OUTPUT PREVIOUS GROUP {% endcomment -%}
			{% if {{rg-GroupByHeading}} %}
				<{{rg-GroupByHeading}}>{% if rg-GroupByHeadingPrefix %}{{rg-GroupByHeadingPrefix}}{% endif %} {{previousItem}}</{{rg-GroupByHeading}}>
			{% endif %}
            {% for groupedItem in groupedItemsArray reversed %}
                {% assign thisGroupedItem = groupedItem | split: "*" %}
				
                {module_webapps id="{{globals.get.CCID}}" filter="item" itemid="{{thisGroupedItem[1]}}" collection="test" template="{{rg-Template}}" }
            {% endfor %}
            
            {% comment %} AFTER GROUP {% endcomment %}
            {% if aftergroup %}{{ aftergroup }}{% endif %}
                
            {% comment -%} Reset groupedItem string. {% endcomment -%}
            {% assign groupedItems = item -%}

		{% endif -%}
    
    {% endfor %}
{% comment -%} Otherwise output not reversed {% endcomment -%}
{% else %}
	{% for item in allItems %}
        {% assign outputGroupItems = false -%}
		{% assign doesNotMatch = false -%}

        {% comment -%} Divide the item into group type and item id {% endcomment -%}
        {% assign thisItem = item | split: "*" %}
        {% comment -%} Is this the 1st item? {% endcomment -%}
        {% if forloop.first %}
            {% comment -%} Don't render module. Set up for next loop {% endcomment -%}
            {% assign groupedItems = item %}
            {% assign previousItem = thisItem[0] %}
            {% if forloop.last %}
				{% assign outputGroupItems = true -%}
            {% endif %}
        {% else -%}
            {% comment -%} DOES NOT MATCH PREVIOUS ITEM. Setup to output previous group. {% endcomment -%}
            {% if thisItem[0] != previousItem -%}
                {% assign outputGroupItems = true -%}
				{% assign doesNotMatch = true -%}
            {% comment -%} MATCHES PREVIOUS ITEM. Unless last item, don't output yet. {% endcomment -%}
            {% else -%}
                {% comment -%} Append this item to rest of items in group (via string) {% endcomment -%}
                {% assign groupedItems = groupedItems | append: {{seperator}} | append: item -%}
                {% comment %} Last Item? Output current group. {% endcomment -%}
                {% if forloop.last -%}
                    {% assign outputGroupItems = true -%}
                {% endif -%}
            {% endif -%}
        {% endif -%}
        
        {% comment -%} OUTPUT PREVIOUS GROUP {% endcomment -%}
        {% if outputGroupItems -%}
            
            {% comment %} BEFORE GROUP {% endcomment -%}
            {% if beforegroup %}{{ beforegroup }}{% endif -%}
            
            {% comment %} Create an array with all of the items in previous group. {% endcomment %}
            {% assign groupedItemsArray = groupedItems | split: {{seperator}} | sort %}
            
            {% comment -%} OUTPUT PREVIOUS GROUP {% endcomment -%}
			{% if {{rg-GroupByHeading}} %}
				<{{rg-GroupByHeading}}>{% if rg-GroupByHeadingPrefix %}{{rg-GroupByHeadingPrefix}}{% endif %} {{previousItem}}</{{rg-GroupByHeading}}>
			{% endif %}
			{% for groupedItem in groupedItemsArray %}
                {% assign thisGroupedItem = groupedItem | split: "*" %}
                {module_webapps id="{{globals.get.CCID}}" filter="item" itemid="{{thisGroupedItem[1]}}" collection="test" template="{{rg-Template}}" }
            {% endfor %}
            
            {% comment %} AFTER GROUP {% endcomment %}
            {% if aftergroup %}{{ aftergroup }}{% endif %}
                
            {% comment -%} Reset groupedItem string. {% endcomment -%}
            {% assign groupedItems = item -%}
            
        {% endif -%}
        
        {% comment %} Set the previous item as this item, to make calculations next round. {% endcomment %}
        {% assign previousItem = thisItem[0] %}

		{% comment %} If this is the last item in the for loop, output it before leaving the loop {% endcomment %}

		{% if forloop.last and doesNotMatch -%}	

			{% comment %} BEFORE GROUP {% endcomment -%}
            {% if beforegroup %}{{ beforegroup }}{% endif -%}
            
            {% comment %} Create an array with all of the items in previous group. {% endcomment %}
            {% assign groupedItemsArray = groupedItems | split: {{seperator}} | sort %}
            
            {% comment -%} OUTPUT PREVIOUS GROUP {% endcomment -%}
			{% if {{rg-GroupByHeading}} %}
				<{{rg-GroupByHeading}}>{% if rg-GroupByHeadingPrefix %}{{rg-GroupByHeadingPrefix}}{% endif %} {{previousItem}}</{{rg-GroupByHeading}}>
			{% endif %}
            {% for groupedItem in groupedItemsArray reversed %}
                {% assign thisGroupedItem = groupedItem | split: "*" %}
				
                {module_webapps id="{{globals.get.CCID}}" filter="item" itemid="{{thisGroupedItem[1]}}" collection="test" template="{{rg-Template}}" }
            {% endfor %}
            
            {% comment %} AFTER GROUP {% endcomment %}
            {% if aftergroup %}{{ aftergroup }}{% endif %}
                
            {% comment -%} Reset groupedItem string. {% endcomment -%}
            {% assign groupedItems = item -%}

		{% endif -%}
    
    {% endfor %}
{% endif %}