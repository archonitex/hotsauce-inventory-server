//Minimize the below code and update the snippet in BatchestList.jsx

function dymoPrint(templateXml) {
    try
    {
        var label = dymo.label.framework.openLabelXml(templateXml);

        // select printer to print on
        // for simplicity sake just use the first LabelWriter printer
        var printers = dymo.label.framework.getPrinters();
        if (printers.length == 0)
            throw "No DYMO printers are installed. Install DYMO printers.";

        var printerName = "";
        for (var i = 0; i < printers.length; ++i)
        {
            var printer = printers[i];
            if (printer.printerType == "LabelWriterPrinter")
            {
                printerName = printer.name;
                break;
            }
        }
        
        if (printerName == "")
            throw "No LabelWriter printers found. Install LabelWriter printer";
            
        // finally print the label
        label.print(printerName);
    }
    catch(e)
    {
        alert(e.message || e);
    }
}