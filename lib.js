var Rasterizer = {};
Rasterizer.Instances = [];
Rasterizer.CreateIn = function(inJQContainer, inWidth, inHeight)
{
	var obj = {};
	
	obj.Math = {};
	obj.Math.Min = [0, 0];
	obj.Math.Max = [1, 1];
	obj.JQ = {};
	obj.JQ.Canvas = $("<canvas width=\""+inWidth+"\" height=\""+inHeight+"\"></canvas>");
	inJQContainer.append(obj.JQ.Canvas);
    
	obj.Canvas = obj.JQ.Canvas.get(0).getContext("2d");
	
	Rasterizer.Instances.push(obj);
	return obj;
};
Rasterizer.CreateFrom = function(inJQCanvas)
{
	var obj = {};
	
	obj.Math = {};
	obj.Math.Min = [0, 0];
	obj.Math.Max = [1, 1];
	obj.JQ = {};
	obj.JQ.Canvas = inJQCanvas;
	
	obj.Canvas = obj.JQ.Canvas.get(0).getContext("2d");
	
	Rasterizer.Instances.push(obj);
	return obj;
};
Rasterizer.Bake = function(inRasterizer, inJQImage)
{
    inRasterizer.Canvas.drawImage(inJQImage.get(0), 0, 0, inRasterizer.Canvas.canvas.width, inRasterizer.Canvas.canvas.height);
};
Rasterizer.ArrayRead = function(inRasterizer)
{
    var out = [];
    
    Rasterizer.Iterate(inRasterizer, function(inMathX, inMathY, inScreenX, inScreenY)
    {
        var data = inRasterizer.Canvas.getImageData(inScreenX, inScreenY, 1, 1).data;
        out.push([data[0]/255, data[1]/255, data[2]/255]);
    });
    
    return out;
};
Rasterizer.ArrayWrite = function(inRasterizer, inArray)
{
    var counter = -1;
    Rasterizer.Iterate(inRasterizer, function(inMathX, inMathY, inScreenX, inScreenY)
    {
        counter++;
        return inArray[counter];
    });
};
Rasterizer.FillStyle = function(inRasterizer, inR, inG, inB)
{
	inR = Math.floor(inR*255);
	inG = Math.floor(inG*255);
	inB = Math.floor(inB*255);
	inRasterizer.Canvas.fillStyle = "rgba("+inR+","+inG+","+inB+",255)";				
};
Rasterizer.ColorClear = function(inRasterizer, inR, inG, inB)
{
	Rasterizer.FillStyle(inRasterizer, inR, inG, inB);
	inRasterizer.Canvas.fillRect( 0, 0, inRasterizer.Canvas.canvas.width, inRasterizer.Canvas.canvas.height);
};
Rasterizer.ColorSet = function(inRasterizer, inR, inG, inB, inX, inY)
{
	Rasterizer.FillStyle(inRasterizer, inR, inG, inB);
	inRasterizer.Canvas.fillRect( inX, inY, 1, 1 );
};
Rasterizer.Iterate = function(inRasterizer, inFunction)
{
    Rasterizer.IterateRow(inRasterizer, 0, inRasterizer.Canvas.canvas.height, inFunction);
};
Rasterizer.IterateRow = function(inRasterizer, inStart, inStop, inFunction)
{
	var width = inRasterizer.Canvas.canvas.width;
	var height = inRasterizer.Canvas.canvas.height;
	var xPos, yPos;
	var xPerc, yPerc;
	var xMath, yMath;
	var output;
	
	for(xPos = 0; xPos<width; xPos++)
	{
		xPerc = xPos/width;
		xMath = inRasterizer.Math.Min[0] + xPerc*(inRasterizer.Math.Max[0] - inRasterizer.Math.Min[0]);
		
		for(yPos=inStart; yPos<inStop; yPos++)
		{
			yPerc = yPos/height;
			yMath = inRasterizer.Math.Min[1] + yPerc*(inRasterizer.Math.Max[1] - inRasterizer.Math.Min[1]);
			
			output = inFunction(xMath, yMath, xPos, yPos);
			if(output)
			{
				Rasterizer.ColorSet(inRasterizer, output[0], output[1], output[2], xPos, yPos)
			}
		}
	}
};
