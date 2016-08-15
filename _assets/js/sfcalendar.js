/**
 * sfCalendar
 *
 * @version: 1.10
 * @author SimpleFlame http://www.simpleflame.com/
 *
 * Other settings:
 *  months       - labels for month names
 *  monthsShort  - shortname labels for month names
 *  days         - labels for day names
 *  daysShort    - shortname labels for day names
 *  listWrapper  - wrapper for the aside content column 
 *  calWrapper   - wrapper for the aside content column 
 *  tagsWrapper  - wrapper for the aside content column 
 *  tagsList     - custom element with tags
 *  defaultView  - 'today'
 *  tagsWidget    - list or select, default list
 *  order        - display order events (asc|desc) , default asc
 *  orderBy      - order events by (startDate|endDate), default startDate
 *  unique       - should display the multiday event only once instead of for every occurence - default true 
 *  paginationWrapper - wrapper for day/month pagination
 *  itemCallback - function that will be run after each item is added to the listing. "this" will relate to this DOM element
 */ 
(function($){
	"use strict";
	
	var Calendar = function(el){
		this.$root = $(el);

		this.settings = {
			'months'      : ['January','February','March','April','May','June','July','August','September','October','November','December'],
			'monthsShort' : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
			'days'        : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
			'daysShort'   : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
			'defaultView' : 'today',
			'dataItem'    : '.data .item',
			'tagsWidget'  : 'list',
			'tagsList'    : null,
			'order'       : 'asc',
			'orderBy'     : 'startDate',
			'unique'      : true,						
			'itemCallback': function(){}
		};


		var options = arguments[1] || {};
		this.settings = $.extend(this.settings, options);

		this.items = this.parseData();

		this.structure();	
		
		this.dateCache();
		
		this.init();
	};

	// In order to compare dates we have to make sure that values match to to the millisecond,
	// so every date has to be normalized.
	// You can pass true as the second parameter to set to the end of the day
	Calendar.prototype.normalizeDate = function(date){
		if (!arguments[1]) {
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);					
			date.setMilliseconds(0);		
		}
		else { //end of the day
			date.setHours(23);
			date.setMinutes(59);			
			date.setSeconds(59);			
			date.setMilliseconds(999);						
		}
		
		return date;
	};


	// General structure of calendar listing
	Calendar.prototype.structure = function(){

		var period = this.periodWidget();
		
		if (this.settings.periodWrapper) {
			$(this.settings.periodWrapper).append(period);
		}
		else {
			this.$root.append(period);
		}

			
		//events listing	
		var list = this.listWidget();	
		if (this.settings.listWrapper) {
			$(this.settings.listWrapper).append(list);
		}
		else {
			this.$root.append(list);
		}
		
		//calendar		
		var cal = this.calWidget();		
		if (this.settings.calWrapper) {
			$(this.settings.calWrapper).append(cal);
		}
		else {
			this.$root.append(cal);
		}
		
		var nav = this.navWidget();
		if (this.settings.navWrapper) {
			$(this.settings.navWrapper).append(nav);
		}
		else {
			cal.before(nav);
		}
		
		//tags
		if (this.settings.tagsList) { //custom tags listing
			this.$tags = $(this.settings.tagsList);
			this.tagsListWidgetAddEvents(this.$tags);
		}
		else {			
			var tags = this.tagsWidget();
			
			if (this.settings.tagsWrapper) { //custom tags wrapper
				$(this.settings.tagsWrapper).append(tags);
			}
			else {
				this.$root.append(tags);
			}					
		}
		
		//pagination
		var pagination = this.paginationWidget();
		if (this.settings.paginationWrapper) {			
			$(this.settings.paginationWrapper).append(pagination);
		}
		else {
			this.$root.append(pagination);
		}
	};

	//Explodes a comma separated string into an array of trimmed strings
	Calendar.prototype.parseTags = function(str){
		var tags = str.split(',');
		return $.map(tags,function(tag){
			tag = $.trim(tag); //removes whitespace
			return tag ? tag : null; //removes empty tags
		});
	};


	// Reads events data from html
	Calendar.prototype.parseData = function(){
		var 
			items = [],
			self = this,
			tags = [];

		var monthIndexes = {};	
		$.each(this.settings.monthsShort,function(index, item){
			monthIndexes[item] = index;
		});	

		this.$root.find('div.data div.item').each(function(eventIndex, item){

			var 
				startDateArr, startDate, eventDates, endDate, endDateArr, startTime, endTime, 
				oneDayMilliseconds,diffDays, tDate, i,
				itemTags = self.parseTags($(this).find('.tags').text()),
				content = $(this).html();
				
			//append item tags to global array
			$.each(itemTags, function(index, item){
				if ($.inArray(item, tags) === -1) {
					tags[tags.length] = item;					
				}
			});

			startDateArr = $(this).data('start').split('-');
			startDate = new Date();			
			startDate.setFullYear(startDateArr[2], monthIndexes[startDateArr[1]], startDateArr[0]);
			startDate = self.normalizeDate(startDate);

			eventDates = [startDate];

			endDate = null;

			if ($(this).data('end') !== '') {
				endDateArr = $(this).data('end').split('-');
				endDate = new Date();			
				endDate.setFullYear(endDateArr[2], monthIndexes[endDateArr[1]], endDateArr[0]);
				endDate = self.normalizeDate(endDate);				

				startTime = startDate.getTime();
				endTime = endDate.getTime();
				oneDayMilliseconds = 60*60*24*1000;				
				diffDays = (endTime - startTime)/oneDayMilliseconds;

				for (i = 1; i <= diffDays; i++){
					tDate = new Date();					
					tDate.setTime(startTime + i * oneDayMilliseconds);
					tDate.setTime(tDate.getTime() - (startDate.getTimezoneOffset() - tDate.getTimezoneOffset()) * 60000);					
					eventDates[eventDates.length] = tDate;
				}

			}

			$.each(eventDates,function(index, date){
				var event = {
					id : eventIndex, //unique id for add - simply index in the array of all events  
					content : content,
					tags : itemTags,
					date : date,
					startDate : startDate,
					endDate : endDate				
				};			

				items[items.length] = event;				
			});

		});	

		this.tags = tags;
		this.activeTags = [];

		//we no longer need data list
		this.$root.find('div.data').remove();

		//sort items by date
		items.sort(function(a,b){
			if (a.date < b.date) {
				return -1;
			}
			if (a.date > b.date) {
				return 1;
			}
			return 0;
		});

		return items;
	};

	// Basically checks if any item tag is in the array of currently active tabs
	Calendar.prototype.isEventInActiveTags = function(item) {
		if (this.activeTags.length === 0) {
			return true;
		}

		var 
			self = this,
			flag = false;

		$.each(item.tags, function(index, tag){
			if ($.inArray(tag, self.activeTags) > -1) {
				flag = true;
				return false; //break out from the loop
			}
		});

		return flag;
	};

	// Filters item set to return only these from a given month
	Calendar.prototype.fetchEventsForMonth = function(date){
		var 
			self = this,
			month = date.getMonth(),
			year = date.getFullYear();

		return $.grep(this.items, function(item){
			if (self.isEventInActiveTags(item) === false) {
				return false;
			}
			return (item.date.getMonth() === month && item.date.getFullYear() === year);
		});
	};

	// Return events for a particular day	
	Calendar.prototype.fetchEventsForDay = function(date){
		var 
			self = this,
			month = date.getMonth(),
			year = date.getFullYear(),
			day = date.getDate();

		return $.grep(this.items, function(item){
			if (self.isEventInActiveTags(item) === false) {
				return false;
			}			
			return (item.date.getMonth() === month && item.date.getFullYear() === year && item.date.getDate() === day);
		});
	};

	// Returns all events between a particular date
	Calendar.prototype.fetchEventsForPeriod = function(startDate, endDate){
		var 
			self = this;

		startDate = this.normalizeDate(startDate);
		endDate = this.normalizeDate(endDate, true); //second parameter this will set at the very last moment of the day		

		return $.grep(this.items, function(item){
			if (self.isEventInActiveTags(item) === false) {
				return false;
			}			
			return (item.date.valueOf() >= startDate.valueOf() && item.date.valueOf() <= endDate.valueOf());
		});
	};


	//Builds month navigation
	Calendar.prototype.navWidget = function(){
		var 
			nav = $('<p class="sfcalendar-widget-nav" />'),
			months = this.settings.months,
			n = this.normalizeDate;

		//click on nav items
		nav.on('click','a',$.proxy(function(e){
			e.preventDefault();
			$(document).trigger('setmonth.sfcalendar', [ $(e.target).data('date') ]);
		},this));

		//builds previous and next links 
		var createLink = function(d, offset, className){
			var date = new Date(d.getTime());				
			date.setMonth(date.getMonth() + offset);			
			n(date); //normalize date
			
			return $('<a href="#" class="' + className + '">' + months[date.getMonth()] +' '+ date.getFullYear() + '</a>').data('date',date);
		};

		
		$(document).bind('setday.sfcalendar setmonth.sfcalendar setweek.sfcalendar',$.proxy(function(event, date){
			nav.empty();

			var 
				prev = createLink(date, -1, 'prev'),
				next = createLink(date, 1, 'next'),
				current = createLink(date, 0, 'current');			

			nav.append(prev, document.createTextNode(' ') , current , document.createTextNode(' ') , next);					
			
		}));

		return nav;
	};

	Calendar.prototype.periodWidget = function(){
		
		var 
			period = $('<span class="sfcalendar-widget-period"/>'),
			days = this.settings.days,
			months = this.settings.months;
			
		//update listing when date is change in the calendar
		$(document).bind('setday.sfcalendar', function(event,date){
			$('span.sfcalendar-widget-period').html('<span>Day:</span> ' + days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear());
		});

		$(document).bind('setmonth.sfcalendar', function(event,date){
			$('span.sfcalendar-widget-period').html('<span>Month:</span> ' + months[date.getMonth()] + ' ' + date.getFullYear());			
		});

		$(document).bind('setweek.sfcalendar', function(event,startDate,endDate){
			$('span.sfcalendar-widget-period').html('<span>Week:</span> ' + months[startDate.getMonth()] + ' ' + startDate.getDate() + ' - '+ months[endDate.getMonth()] + ' ' + endDate.getDate() + ', ' + startDate.getFullYear());						
		});
							
		return period;
	};
	
	// Initializes listing 
	Calendar.prototype.listWidget = function(){
		var 
			self = this,
			widget = $('<div class="sfcalendar-widget-list" />');
				
		var updateListing = function(dataItems) {
									
			var 
				previousIDs = [];

			widget.empty(); //remove previous items

			//no results for given month
			if (dataItems.length === 0) {
				widget.append('<p class="empty">No events to show on this date.</p>');
				return;
			}

			dataItems = dataItems.sort(function(a,b){
				if (a.hasOwnProperty(self.settings.orderBy) === false){
					return 0; //do not order if field doesn't exist
				}
				
				var 
					x = a[self.settings.orderBy],
					y = b[self.settings.orderBy],
					mod = 1;
					
				if (self.settings.order === 'desc') {
					mod = -1;
				}
				
				if (x > y) {
					return mod;
				}
				else if (x < y) {
					return mod * -1;
				}
				return 0;
			});
						
			$.each(dataItems, function(index, item){				

				if (self.settings.unique && $.inArray(item.id, previousIDs) > -1) {
					return;
				}
				
				previousIDs.push(item.id); 

				var el = $('<div class="item"/>');
				el.append(item.content);
				
				self.settings.itemCallback.apply(el, [item]);
				
				
				widget.append(el);
			});			
		};					

		//update listing when date is change in the calendar
		$(document).bind('setday.sfcalendar', $.proxy(function(event,date){
			updateListing(this.fetchEventsForDay(date));
		},this));

		$(document).bind('setmonth.sfcalendar', $.proxy(function(event,date){
			updateListing(this.fetchEventsForMonth(date));
		},this));

		$(document).bind('setweek.sfcalendar', $.proxy(function(event,startDate,endDate){
			updateListing(this.fetchEventsForPeriod(startDate,endDate));
		},this));		
		
		this.$list = widget;
		
		return widget;				
	};

	// Pagination widget
	Calendar.prototype.paginationWidget = function(){
		var 
			wrap = $('<ul class="sfcalendar-widget-pagination"><li class="prev"><a href="#"/></li><li class="next"><a href="#"/></li></ul>');
			
		//because pagination can be in more than one place we cannot set references to items
		
		$('body').on('click','ul.sfcalendar-widget-pagination a',$.proxy(function(e){
			e.preventDefault();						
			$(document).trigger($(e.target).data('event'), [ $(e.target).data('date') ]);
		},this));
		

		$(document).bind('setday.sfcalendar',$.proxy(function(event, date){
			
			//previous
			var prevDate = new Date(date.getTime());
			prevDate.setHours(-1); //last hour of previous day
			this.normalizeDate(prevDate);
						
			$('ul.sfcalendar-widget-pagination li.prev a').text('Yesterday').data({
				event : 'setday.sfcalendar',
				date : prevDate
			});
			
			
			//next
			var nextDate = new Date(date.getTime());
			nextDate.setHours(24); //first hour of next day
			this.normalizeDate(nextDate);
						
			$('ul.sfcalendar-widget-pagination li.next a').text('Tomorrow').data({
				event : 'setday.sfcalendar',
				date : nextDate
			});		
		},this));
		
		$(document).bind('setmonth.sfcalendar',$.proxy(function(event, date){

			//previous
			var prevDate = new Date(date.getTime());
			prevDate.setMonth(prevDate.getMonth() - 1); //previous month
			this.normalizeDate(prevDate);			
			
			$('ul.sfcalendar-widget-pagination li.prev a').text(this.settings.months[prevDate.getMonth()]).data({
				event : 'setmonth.sfcalendar',
				date : prevDate
			});
			
			
			//next
			var nextDate = new Date(date.getTime());
			nextDate.setMonth(nextDate.getMonth() + 1); //next month
			this.normalizeDate(nextDate);
			
			$('ul.sfcalendar-widget-pagination li.next a').text(this.settings.months[nextDate.getMonth()]).data({
				event : 'setmonth.sfcalendar',
				date : nextDate
			});
			
		},this));		
		
		return wrap;
	};

	// Tags filter list
	Calendar.prototype.tagsWidget = function(){
		if (this.settings.tagsWidget === 'select') {
			return this.tagsSelectWidget();
		}
		return this.tagsListWidget();
	};
	
	Calendar.prototype.tagsListWidget = function(){
		var widget = $('<ul class="sfcalendar-widget-tags" />');		

		$.each(this.tags, function(index, item){
			var
				$li = $('<li><label for="sfcalendar-tag-'+index+'" class="checkbox-a"> '+item+'</label></li>'),
				$checkbox = $('<input type="checkbox" id="sfcalendar-tag-'+index+'" value="'+item+'"/>');

			$li.find('label').prepend($checkbox);
			widget.append($li);
		});

		this.tagsListWidgetAddEvents(widget);
		this.$tags = widget;
		
		return widget;
	};
	
	Calendar.prototype.tagsListWidgetAddEvents = function(widget){
		widget.on('click','input[type="checkbox"]',$.proxy(function(e){
			var data = [];

			widget.find('input:checked').each(function(){
				data[data.length] = $(this).val();
			});

			this.activeTags = data;

			$(document).trigger($(document).data('event.sfcalendar'), $(document).data('date.start.sfcalendar'), $(document).data('date.end.sfcalendar'));						
		},this));		
		
		this.$tags = widget;
		
		return widget;
	};
	
	Calendar.prototype.tagsSelectWidget = function(){
		var 
			widget = $('<p class="sfcalendar-widget-tags"><label for="sfcalendar-tag">Refine by Event Type</label> <select id="sfcalendar-tag" name="sfcalendar-tag"><option/></select>'),
			select = widget.find('select');

		$.each(this.tags, function(index, item){
			select.append('<option value="'+item+'">'+item+'</option>');
		});

		this.tagsSelectWidgetAddEvents(widget);
		return widget;		
	};
		
	Calendar.prototype.tagsSelectWidgetAddEvents = function(widget){
		widget.find('select').change($.proxy(function(e){
			var val = $(e.target).val();

			this.activeTags = [];
			if (val) {
				this.activeTags = [val];
			}
			
			$(document).trigger($(document).data('event.sfcalendar'), $(document).data('date.start.sfcalendar'), $(document).data('date.end.sfcalendar'));						
		},this));		
		
		return widget;		
	};
	
	Calendar.prototype.dateCache = function(){
		$(document).bind('setday.sfcalendar setmonth.sfcalendar setweek.sfcalendar',$.proxy(function(event, dateStart){
			
			var dateEnd = arguments[2] || null;
			
			$(document).data({
				"event.sfcalendar" : event.type,
				"date.start.sfcalendar" : dateStart,
				"date.end.sfcalendar" : dateEnd
			});			
			
		},this));
	};
	
	// Builds calendar widget
	Calendar.prototype.calWidget = function(){
		var 
			widget = $('<div class="sfcalendar-widget-cal"/>');

		//catches clicks on the whole calendar widget
		widget.on('click','table a',function(e){
			e.preventDefault();

			var target = $(e.target);

			//month cell click
			if (target.hasClass('month')) {
				$(document).trigger('setmonth.sfcalendar',[ target.data('date') ]);
			}
			//week cell click
			else if (target.hasClass('week')) {
				$(document).trigger('setweek.sfcalendar',[ target.data('date.start'), target.data('date.end') ]);
			}
			//day cell click
			else {
				$(document).trigger('setday.sfcalendar',[ target.data('date') ]);
			}
		});

		//selecting whole month
		$(document).bind('setmonth.sfcalendar',$.proxy(function(event, date){							
			this.buildCalendar(date);
			this.populateCalendar(date);
						
			widget.find('td a').addClass('selected');			
		},this));

		//selecting only one week
		$(document).bind('setweek.sfcalendar', $.proxy(function(event, startDate, endDate){
			this.buildCalendar(startDate);
			this.populateCalendar(startDate);

			widget.find('tbody th a').each(function(){
				if ($(this).data('date.start').valueOf() === startDate.valueOf()) {
					$(this).parents('tr').find('td a').addClass('selected');
				}
			});
		},this));		

		//selecting a particular day
		$(document).bind('setday.sfcalendar', $.proxy(function(event, date){
			this.buildCalendar(date);
			this.populateCalendar(date);

			widget.find('tbody td a').each(function(){
				if ($(this).data('date.start').valueOf() === date.valueOf()) {
					$(this).addClass('selected');
				}
			});
		},this));

		this.$cal = widget;
							
		return widget;
	};

	// Transform text into a URL slug: spaces turned into dashes, remove non alnum
	// @param string text
  // @url http://milesj.me/snippets/javascript/slugify	
	Calendar.prototype.slugify = function(text) {
		text = text.replace(/[^\-a-zA-Z0-9,&\s]+/ig, '');
		text = text.replace(/-/gi, "_");
		text = text.replace(/\s/gi, "-");
		text = text.toLowerCase();
		return text;			
	};
	
	// Fetches events for current month and marks them in the calendar
	Calendar.prototype.populateCalendar = function(date){
		var 
			tdate, weekday, self = this,
			dataItems = this.fetchEventsForMonth(date);

		tdate = new Date(date.getTime());
		tdate.setDate(1);
		weekday = tdate.getDay();

		this.$cal.find('a.event').removeClass('event');

    $.each(dataItems, function () {
        var 
					day = this.date.getDate() + weekday - 1, //we add weekday as it's the offset at the beginning of the calendar
					trig = self.$cal.find('td').eq(day).find('a');

        trig.addClass('event');
				$.each(this.tags,function(index, item){
					trig.addClass('tag-' + self.slugify(this));
				});
    });					
	};

	// Creates HTML for calendar widget
	Calendar.prototype.buildCalendar = function(tDate){
		
		var date = new Date(tDate.getTime());	
		
		date.setDate(1); //reset to the first day of the month
		date = this.normalizeDate(date);	

		var 
			weekday, rows, $row, $cell, $trigger, daysLimit, dayDate,
			firstDayOfMonth,
			i,j,
			counter = 0,
			displayedDay = 1,
			daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31],

			$table = $('<table summary="Calendar for ' + parseInt(date.getMonth() + 1, 10) + '.'+ date.getFullYear() +'"><thead/><tbody/></table>'),
			selectWeekStartDate, selectWeekEndDate;

		//cleanup
		this.$cal.empty(); //remove previous items
		
		if (date.getFullYear() % 4 === 0) {
			daysInMonth[1] = 29;
		}

		//weekday of the first day of current month
		weekday = date.getDay();
		daysLimit = daysInMonth[date.getMonth()] + weekday;
		rows = Math.ceil(daysLimit / 7);

		//header row
		$row = $('<tr />');
		$trigger = $('<a href="#" class="month">M</a>').data('date',date); //month changing trigger
		$cell = $('<th scope="col"/>');
		//$row.append($cell.append($trigger));

		//day names
		$.each(this.settings.daysShort, function(){
			$row.append('<th scope="col">'+this+'</th>');
		});

		$table.find('thead').append($row);

		firstDayOfMonth = false;

		for (i = 0; i < rows; i++) {
			//week selecting row
			$row = $('<tr />');

			//cells
			for (j = 0; j < 7; j++) {
				$cell = $('<td class="col' + parseInt(j+1,10) + '"/>');

				//existing day in month
				if (counter >= weekday && counter < daysLimit) {

					dayDate = new Date(date.getFullYear(),date.getMonth(),displayedDay,0,0,0);

					//look for the first day in month/week
					if (firstDayOfMonth === false || j === 0) {
						selectWeekStartDate = dayDate;
					}
					firstDayOfMonth = true;

					//look for the last day of the week
					if (j === 6 || counter + 1 === daysLimit) { 
						selectWeekEndDate = dayDate;
					}

					$trigger = $('<a href="#">'+ displayedDay +'</a>').data('date', dayDate);
					$cell.append($trigger);
					displayedDay++;
				}
				else {
					$cell.html('&nbsp;');
					$cell.addClass('inactive');					
				}

				counter++;
				$row.append($cell);
			}

			//week selection trigger			
			$cell = $('<th scope="row"/>');
			$trigger = $('<a href="#" class="week">W</a>').data('date.start',selectWeekStartDate).data('date.end',selectWeekEndDate);			
			//$row.prepend($cell.append($trigger));

			$table.find('tbody').append($row);
		}

		this.$cal.append($table);		
	};

	Calendar.prototype.init = function(){
		
		var now = this.normalizeDate(new Date());					

		//active today's date
		if (this.settings.defaultView === 'month') {
			now.setDate(1);
			$(document).trigger('setmonth.sfcalendar',[ now ]);			
		}
		else {
			$(document).trigger('setday.sfcalendar',[ now ]);				
		}		
	};
	
	$.fn.sfCalendar = function(options){
		return $(this).each(function(){
			return new Calendar(this,options);
		});
	};

}(jQuery));