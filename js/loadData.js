// array to fill with data of correct form
var dates = [];

// load json file ADD ERROR
d3.json("data/payments.json", function(data) {
   // date formats
    var parseTime = d3.timeParse("%d/%m/%Y");


    // filter out bad data
    var data = data.filter(function(d) {
        if (d.state.on.unix < 1477094400000 || d.state.on.unix > 1482537600000 || d.state.refunded || d.amount.positive) {
            return false
        } 
        return true
    })
    
    // map through original json, create new one in dates
    data.map(function(d){ 
        var date = parseTime(d.state.on.date).getTime();   
        var date_object = {};
        var date_exists = 0;

        // Make first date object
        if (dates.length == 0) {
            date_object["date"] = date;
            date_object["Spectrum"] = {datum: d.state.on.date, bier: 0, fris: 0, speciaalbier: 0, drankoverig: 0, overig: 0, totaal: 0};
            date_object["Congo"] = {datum: d.state.on.date, bier: 0, fris: 0, speciaalbier: 0, drankoverig: 0, overig: 0, totaal: 0};
            dates.push(date_object);
        }

        // Check if date is same as transaction and add products to object counts
        dates.map(function(element){
            if (element.date == date) {
                date_exists = 1;

                // Check for every product if it is one of the chosen
                d.products.map(function(product){
                    idProduct = product._id.$oid;
                    if (idProduct == "57cd872a3068d0401719d1a3") {
                        element.Spectrum.bier += 1;
                        element.Spectrum.totaal += 1;
                    } else if (idProduct == "57cd87343068d0401719d1b3") {
                        element.Spectrum.fris += 1;
                        element.Spectrum.totaal += 1;
                    } else if (idProduct == "57ed163cc17083e90b377702" || idProduct == "57cd8db13068d0401719df2f") {
                        element.Spectrum.speciaalbier += 1;
                        element.Spectrum.totaal += 1;
                    } else if (idProduct == "57cd874c3068d0401719d1c3") {
                        element.Spectrum.drankoverig += 1;
                        element.Spectrum.totaal += 1;
                    } else if (idProduct == "57fd049b72776cf1033b3578") {
                        element.Spectrum.fris += 1;
                        element.Spectrum.totaal += 1;
                    } else if (idProduct == "57c2b4cb7672fa9201fa0aa9") {
                        element.Congo.bier += 1;
                        element.Congo.totaal += 1;
                    } else if (idProduct == "57c2c8dc9bbbd25d75c124df") {
                        element.Congo.fris += 1;
                        element.Congo.totaal += 1;
                    } else if (idProduct == "57c2b4f67672fa9201fa0ab6") {
                        element.Congo.speciaalbier += 1;
                        element.Congo.totaal += 1;
                    } else if (idProduct == "57c2b5197672fa9201fa0ace") {
                        element.Congo.overig += 1;
                        element.Congo.totaal += 1;
                    }
                });
            }
        });
        if (date_exists == 0) {
            date_object["date"] = date;
            date_object["Spectrum"] = {datum: d.state.on.date, bier: 0, fris: 0, speciaalbier: 0, overig: 0, totaal: 0};
            date_object["Congo"] = {datum: d.state.on.date, bier: 0, fris: 0, speciaalbier: 0, overig: 0, totaal: 0};
            // Check for every product if it is one of the chosen
            d.products.map(function(product){
                idProduct = product._id.$oid;
                    if (idProduct == "57cd872a3068d0401719d1a3") {
                        date_object.Spectrum.bier += 1;
                        date_object.Spectrum.totaal += 1;
                    } else if (idProduct == "57cd87343068d0401719d1b3") {
                        date_object.Spectrum.fris += 1;
                        date_object.Spectrum.totaal += 1;
                    } else if (idProduct == "57ed163cc17083e90b377702" || idProduct == "57cd8db13068d0401719df2f") {
                        date_object.Spectrum.speciaalbier += 1;
                        date_object.Spectrum.totaal += 1;
                    } else if (idProduct == "57cd874c3068d0401719d1c3") {
                        date_object.Spectrum.drankoverig += 1;
                        date_object.Spectrum.totaal += 1;
                    } else if (idProduct == "57fd049b72776cf1033b3578") {
                        date_object.Spectrum.fris += 1;
                        date_object.Spectrum.totaal += 1;
                    } else if (idProduct == "57c2b4cb7672fa9201fa0aa9") {
                        date_object.Congo.bier += 1;
                        date_object.Congo.totaal += 1;
                    } else if (idProduct == "57c2c8dc9bbbd25d75c124df") {
                        date_object.Congo.fris += 1;
                        date_object.Congo.totaal += 1;
                    } else if (idProduct == "57c2b4f67672fa9201fa0ab6") {
                        date_object.Congo.speciaalbier += 1;
                        date_object.Congo.totaal += 1;
                    } else if (idProduct == "57c2b5197672fa9201fa0ace") {
                        date_object.Congo.overig += 1;
                        date_object.Congo.totaal += 1;
                    }
                });
            dates.push(date_object);
        }
    });

    function sortDate(data, prop, asc) {
        data = data.sort(function(a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        })
    };
    sortDate(dates, 'date', true);
    
    
    // // map through original json, create new one in dates
    // var by_date = d3.nest()
    //     .key(function(d) {  return d.state.on.date; }).sortKeys(d3.ascending)
    //     .key(function(d) {  return d.products;  })  
    //     .entries(dates);  

    drawCircles();
});