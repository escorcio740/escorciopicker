# escorciopicker
Custom Date Picker (with the styles of React-Calendar)

# escorciopicker
Custom Date Picker (with the styles of React-Calendar)

To use :

Import the escorciopicker.js file and the escorciopicker.css files into your HTML page.

You don't need any third party library. It's made on pure JS and CSS.

You need to import the 'escorciopicker-modal' div and ALL of his content from demo.html to your page as well. 

You should have a code like this : 


```
<!DOCTYPE html>
<html>
  <head>

    // YOUR CSS
    <link rel="stylesheet" type="text/css" href="escorciopicker.css">

  </head>
  <body>

    // YOU HTML

    <div class="escorciopicker-modal" style="display: none;">
      ... ALL THE CONTENT THERE ...
    </div>

    // YOUR JS FILES
    <script type="text/javascript" src="escorciopicker.js"></script>

  </body>
</html>
```

To initialize the picker you need to have a valid input file, I will use as example the next one (provided as example on demo.html): 

```
<input type="text" class="datepicker">

<script type="text/javascript" src="escorciopicker.js"></script>
<script type="text/javascript">
  const escorcioPickerInstance = new escorcioPicker({

    // This will get the today month and open the picker on that month
    minDate: "today",

    // exclude (disable) some days in the calendar
    excludeDays: {

      // 0 - Monday , 6 - Sunday
      // these weekdays on all calendar will be disabled

      weekdays: [0, 6],
  
      // this specific dates will be disabled
      // If the year is passed in only on that year, if not passed will disable the day-month on all years

      specificDates: [
        "26-12-2023",
        "25-12"
      ]
    },

    //date on input format, need to keep the key words YYYY , MM and DD 
    customFormat: "YYYY-MM-DD",

    // input to receive datepicker information
    input: document.getElementsByClassName("datepicker")[0]
  });
</script>
```

