  var report;
  
  function Report(cid, inv, tlen)
  {
    this.cid = cid;
    this.tlen = tlen;
    this.inv = inv;
    this.paths = [];

    this.generate = function() {

      this.range = this.getIntervalRange();

      _crud(
        {
          action: 'READ',
          columns: 'id, cid, aid, ts, ST_AsText(path), demography, thumbnail, age, gender',
          table: 'Trails',
          where: `cid = ${this.cid} and uid = ${uid} and ts between '${dateToMySql(this.range.start)}' and '${dateToMySql(this.range.end)}'`,
          rows: [{x: 'y'}]
        }, "", (res, e) => {
          if (!e)
          {
            if (this.processRangeData(res))
            {
              let maxHSteps = this.computeHorizontalMaxima(false);
              let maxVSteps = this.computeVerticalMaxima(false);

              let ref = {};

              let hRefCount = maxHSteps[0].counts.up + maxHSteps[0].counts.down;
              let vRefCount = maxVSteps[0].counts.left + maxVSteps[0].counts.right;

              if (hRefCount > vRefCount) {
                ref.x = 0;
                ref.y = (maxHSteps[0].y + maxHSteps[maxHSteps.length-1].y) / 2;
                ref.dir = 'horizontal';
              } else {
                ref.x = (maxVSteps[0].x + maxVSteps[maxVSteps.length-1].x) / 2;
                ref.y = 0;
                ref.dir = 'vertical';
              }

              this.displayIntervalGraph(ref);

              this.showPathAnalyzerCanvas(ref);
            }
          }
        });
    }

    this.getIntervalRange = function() {
  
        let range = {};
        let now = new Date();
    
        if (this.inv == '1Hour') {
          /** 60 mins back from now */
          range.start = dateFromHourOffset(1);
          range.end = dateFromOffset(0);
        } else if (this.inv == 'Today') {
          /** 9 from today morning to 11 midnight, today */
          range.start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9);
          range.end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 59,59);
        } else if (this.inv == 'Daily') {
          /** 14 days earlier from today */
          range.start = dateFromOffset(13);
          range.start.setHours(0);
          range.start.setMinutes(0);
          range.start.setSeconds(0);
          range.end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        } else if (this.inv == 'Monthly') {
          range.start = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
          range.end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        }
        return range;
    }

    this.processRangeData = function(res) {
  
      if (!res.result.length) {
        Metro.toast.create("No data found for the selected camera and interval", null, null, "alert");
        return false;
      }

      for (let i = 0; i < res.result.length; i++) 
      {
        let p = {};
  
        p.trail = (res.result[i]['ST_AsText(path)']).replace(/MULTIPOINT/gi, "").replace(/\(/gi, "").replace(/\)/gi, "").split(",");
  
        if (p.trail.length < this.tlen) continue;

        p.id = res.result[i]['id'];

        p.demography = res.result[i]['demography'].split(",");
  
        p.ts = (res.result[i]).ts;
  
        p.age = (res.result[i]).age;

        p.gender = (res.result[i]).gender;

        if (res.result[i]['thumbnail'].length)
        {
          let row = [
            p.id,
            `<img src=${'data:image/png;base64,' + res.result[i]['thumbnail']}>`,
            p.ts,
            p.age, 
            p.gender, 
            p.trail.length
          ];

          let table = Metro.getPlugin('#id-table-thumbnails', 'table');
          table.addItem(row, true);
        }

        if (p.age)
          this.type = "Demography";
        else
          this.type = "PeopleCount";

        let diff = Math.abs((new Date(p.ts)).getTime() - this.range.start.getTime());
  
        if (this.inv === "1Hour")
        {
          p.bucket = Math.ceil(diff / (1000 * 60 * 5)); // 5min buckets 
        }
        else if (this.inv === 'Today')
        {
          p.bucket = Math.ceil(diff / (1000 * 60 * 60)); // hour buckets 
        }
        else if (this.inv === 'Daily')
        {
          p.bucket = Math.ceil(diff / (1000 * 60 * 60 * 24)); // days bucket
        }
        else if (this.inv === 'Monthly')
        {
          p.bucket = Math.ceil(diff / (1000 * 60 * 60 * 24 * 30.43685)); // month bucket
        }

        this.paths.push(p);
      }

      return true;
    }

    this.showPathAnalyzerCanvas = function(ref){

      let newref;
      let tlen = this.tlen;
      let paths = this.paths;
      let computeHorizontalMaxima = this.computeHorizontalMaxima.bind(this);
      let computeVerticalMaxima = this.computeVerticalMaxima.bind(this);
      let renderPaths = this.renderPaths.bind(this);
      let computeRefLineIntersectionsCount = this.computeRefLineIntersectionsCount.bind(this);
      let displayIntervalGraph = this.displayIntervalGraph.bind(this);

      this.canvas = Metro.window.create({
        resizeable: true,
        draggable: true,
        width: 'auto',
        btnMin: false,
        btnMax: false,
        id: 'id-analyzer-win',
        role: "window",
        icon: "<span class='mif-chart-dots'></span>",
        title: "Trail Analyzer",
        content: '<canvas id="id-trail-analyzer" width="600" height="400" style="border:1px dotted grey" ></canvas>',
        place: "right",
        onShow: function(w)
        {
          let canvas = document.getElementById("id-trail-analyzer");

          canvas.addEventListener("click", function(e){
            newref = getMousePosition("id-trail-analyzer", e);
            let counts = computeRefLineIntersectionsCount(newref);
            drawRefrenceLineAndCounts(newref, counts);
          }, false);

          renderPaths("id-trail-analyzer");

          if (ref.dir === 'horizontal') {
            computeHorizontalMaxima(true);
          } else {
            computeVerticalMaxima(true);
          }
        },
        onClose: function(w)
        {
          if (isDefined(newref))
          {
            displayIntervalGraph(newref);
          }
        }
      });
    }

    this.displayIntervalGraph = function(ref)
    {
      let xAxis = [];

      if (this.chart !== undefined)
      {
        this.chart.destroy();
      }

      let context = document.getElementById('id-chart-canvas').getContext('2d');

      if (this.type == "PeopleCount") {

        this.chart = new Chart(context, {
          type: 'bar',
          data: barChartData,
          options:
           {
            responsive: true,
            legend: {
             position: 'bottom',
            },
            scales: {
             yAxes: [{
               scaleLabel: {
                 display: true,
                 labelString: 'count'
               }
             }],
             xAxes: [{
               scaleLabel: {
                 display: true,
                 labelString: ''
               }
             }]
            }
          }
        });

      } else if (this.type == "Demography") {

        this.chart = new Chart(context, {
          type: 'bar',
          data: AgeGenderChartData,
          options: {
            tooltips: {
              mode: 'index',
              intersect: false
            },
            responsive: true,
            legend: {
              position: 'bottom',
            },
            scales: {
              xAxes: [{
                stacked: true,
              }],
              yAxes: [{
                stacked: true
              }]
            }
          }
        });

      } 
      else 
      {
        show_error("Unable to determine the chart type");
        return;
      }

      if (this.inv === '1Hour')
      {
        this.chart.data.labels = [
          '5m', '10m','15m','20m','25m','30m',
          '35m','40m','45m','50m','55m','60m'];
          this.chart.options.scales.xAxes[0].scaleLabel.labelString = 'Last 1 hour'
      }
      else if (this.inv === 'Today')
      {
        this.chart.data.labels = [
          '9','10','11','12','13',
          '14','15','16','17','18','19','20','21','22','23'];
        this.chart.options.scales.xAxes[0].scaleLabel.labelString = 'Active hours'
      }
      else if (this.inv === 'Daily') 
      {
        for (let i = 0; i < 14; i++) 
        {
          let d = new Date(this.range.start.getTime() + i*86400000);
          
          xAxis[i] = d.getDate() + '/' + parseInt(d.getMonth() + 1);
    
          this.chart.data.labels = xAxis;
        }
        this.chart.options.scales.xAxes[0].scaleLabel.labelString = 'Last 14 days'
      }
      else if (this.inv === "Monthly")
      {
        this.chart.data.labels = [
          'Jan','Feb','Mar','Apr','May',
          'Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        this.chart.options.scales.xAxes[0].scaleLabel.labelString = (new Date()).getFullYear();
      }

      for (let i = 1; i <= this.chart.data.labels.length; i++)
      {
        let bucketPaths = [];

        for (let j = 0; j < this.paths.length; j++)
        {
          let p = this.paths[j];

          if (p.bucket === i)
          {
            bucketPaths.push(p);
          }
        }

        if (this.type == "PeopleCount")
        {
          let bucketCounts = {up: 0, down: 0, left: 0,  right: 0};

          if (bucketPaths.length)
          {
            bucketCounts = this.computeRefLineIntersectionsCount(ref, bucketPaths);
          }
  
          if (ref.dir === 'horizontal')
          {
            this.chart.data.datasets[0].label = 'UP';
            this.chart.data.datasets[1].label = 'DOWN';
            this.chart.data.datasets[0].data.push(bucketCounts.up);
            this.chart.data.datasets[1].data.push(bucketCounts.down);
          }
          else if (ref.dir === 'vertical')
          {
            this.chart.data.datasets[0].label = 'LEFT';
            this.chart.data.datasets[1].label = 'RIGHT';
            this.chart.data.datasets[0].data.push(bucketCounts.left);
            this.chart.data.datasets[1].data.push(bucketCounts.right);
          }
        }
        else if (this.type == "Demography")
        {
          this.chart.data.datasets[0].data.push(0); //Math.floor(Math.random() * 100));
          this.chart.data.datasets[1].data.push(0); //Math.floor(Math.random() * 100));
          this.chart.data.datasets[2].data.push(0); //Math.floor(Math.random() * 100));
          this.chart.data.datasets[3].data.push(0); //Math.floor(Math.random() * 100));

          this.chart.data.datasets[4].data.push(0); //Math.floor(Math.random() * 100));
          this.chart.data.datasets[5].data.push(0); //Math.floor(Math.random() * 100));
          this.chart.data.datasets[6].data.push(0); //Math.floor(Math.random() * 100));
          this.chart.data.datasets[7].data.push(0); //Math.floor(Math.random() * 100));

          if (bucketPaths.length)
          {
            for (let k = 0; k < bucketPaths.length; k++)
            {
              let path = bucketPaths[k];
              let index;

              if (path.age <= 18) {
                index = 0 + ((path.gender === "Female") ?  4 : 0);
              } else if (path.age > 18 && path.age <= 35) {
                index = 1 + ((path.gender === "Female") ?  4 : 0);
              } else if (path.age > 35 && path.age <= 50) {
                index = 2 + ((path.gender === "Female") ?  4 : 0);
              } else if (path.age > 50 && path.age <= 75) {
                index = 3 + ((path.gender === "Female") ?  4 : 0);
              }

              let count = this.chart.data.datasets[index].data[i-1];
              this.chart.data.datasets[index].data[i-1] = ++count;
            }
          }
        }
        else
        {
          show_error("Unable to determine the chart type");
          return;
        }
      }

      this.chart.update();
    }

    this.computeHorizontalMaxima = function(draw) {

      let ref = { x: 5, y: 5 };
      let steps = [];
      let max = 0;

      while (ref.y <= 400)
      {
        let counts = this.computeRefLineIntersectionsCount(ref);

        if ((counts.up + counts.down) > max) 
        {
          max = counts.up + counts.down;
        }

        if (draw) 
        {
          drawRefrenceLineAndCounts(ref, counts);
        }

        steps.push({counts: counts, x: ref.x, y: ref.y});
    
        ref.y += 20;
      }

      for (let i = steps.length - 1; i >= 0; i--)
      {
        let step = steps[i];
    
        if((step.counts.up + step.counts.down) != max)
        {
          steps.splice(i, 1);
        }
      }
    
      let yMid = (steps[0].y + steps[steps.length-1].y) / 2;
    
      if (draw)
      {
        let canvas = document.getElementById("id-trail-analyzer");
        let context = canvas.getContext('2d');
      
        context.beginPath();
        context.strokeStyle = "#FF0000";
        context.lineWidth = 1;
        context.setLineDash([5, 3]);
        context.moveTo(steps[0].x, steps[0].y);
        context.lineTo(canvas.width, steps[0].y);
        context.stroke();
      
        context.beginPath();
        context.strokeStyle = "#FF0000";
        context.lineWidth = 1;
        context.setLineDash([5, 3]);
        context.moveTo(steps[steps.length-1].x, steps[steps.length-1].y);
        context.lineTo(canvas.width, steps[steps.length-1].y);
        context.stroke();
      
        context.beginPath();
        context.strokeStyle = "#196F3D";
        context.lineWidth = 1;
        context.moveTo(steps[0].x, yMid);
        context.lineTo(canvas.width, yMid);
        context.stroke();
      }
    
      return steps; 
    }

    this.computeVerticalMaxima = function(draw) {

      let ref = { x: 5, y: 5 };
      let steps = [];
      let max = 0;
    
      while (ref.x <= 600)
      {
        let counts = this.computeRefLineIntersectionsCount(ref);
    
        if ((counts.left + counts.right) > max) 
        {
          max = counts.left + counts.right;
        }
    
        if (draw) 
        {
          drawRefrenceLineAndCounts(ref, counts);
        }
    
        steps.push({counts: counts, x: ref.x, y: ref.y});
    
        ref.x += 20;
      }
    
      for (let i = steps.length - 1; i >= 0; i--)
      {
        let step = steps[i];
    
        if((step.counts.left + step.counts.right) != max)
        {
          steps.splice(i, 1);
        }
      }
    
      let xMid = (steps[0].x + steps[steps.length-1].x) / 2;
    
      if (draw)
      {
        let canvas = document.getElementById("id-trail-analyzer");
        let context = canvas.getContext('2d');
      
        context.beginPath();
        context.strokeStyle = "#FF0000";
        context.lineWidth = 1;
        context.setLineDash([5, 3]);
        context.moveTo(steps[0].x, 0);
        context.lineTo(steps[0].x, canvas.height);
        context.stroke();
      
        context.beginPath();
        context.strokeStyle = "#FF0000";
        context.lineWidth = 1;
        context.setLineDash([5, 3]);
        context.moveTo(steps[steps.length-1].x, 0);
        context.lineTo(steps[steps.length-1].x, canvas.height);
        context.stroke();
      
        context.beginPath();
        context.strokeStyle = "#196F3D";
        context.lineWidth = 1;
        context.moveTo(xMid, 0);
        context.lineTo(xMid, canvas.height);
        context.stroke();
      }
    
      return steps;
    }

    this.computeRefLineIntersectionsCount = function(ref, paths)
    {
      let counts = {up: 0, down: 0, left: 0,  right: 0};
    
      if (paths === undefined) paths = this.paths;

      for (let i = 0; i < paths.length; i++)
      {
        let points = paths[i].trail;
    
        if (points.length > this.tlen)
        {
          let sp = points[0].split(" ");
          let ep = points[points.length - 1].split(" ");
    
          //horizontal ref line
          if ((sp[1] < ref.y) && (ep[1] >= ref.y))
          {
            counts.down++;
          }
          else if ((sp[1] > ref.y) && (ep[1] <= ref.y))
          {
            counts.up++;
          }
          //vertical ref line
          if ((sp[0] < ref.x) && (ep[0] >= ref.x))
          {
            counts.right++;
          }
          else if ((sp[0] > ref.x) && (ep[0] <= ref.x))
          {
            counts.left++;
          }
        }
      }
    
      return counts;
    }

    this.renderPaths = function(id)
    {
      canvas = document.getElementById(id);
      let context = canvas.getContext("2d");
    
      for (let i = 0; i < this.paths.length; i++)
      {
        let points = this.paths[i].trail;
    
        if (points.length > this.tlen)
        {
          // draw path
          context.beginPath();
          context.strokeStyle = "#000000";
    
          for (let j = 0; j < points.length; j++)
          {
            let cords = points[j].split(" ");
            context.fillStyle = "#5b5b5b";
            context.fillRect(cords[0], cords[1], 1, 1);
          }
    
          let sp = points[0].split(" ");
          let ep = points[points.length - 1].split(" ");
          // draw start-end displacement
          context.beginPath();
          context.moveTo(sp[0], sp[1]);
          context.lineTo(ep[0], ep[1]);
          context.strokeStyle = "#00b0ff";
          context.stroke();
          // draw end point red square
          context.beginPath();
          context.fillStyle = "#FF0000";
          context.fillRect(ep[0], ep[1], 5, 5);
        }
      }
    }

    this.close = function() {
      let e = Metro.getPlugin(this.canvas, "window");
      if (e != undefined)
      {
        e.close();
      }
      $("#id-thumbnails").empty();
      let table = Metro.getPlugin('#id-table-thumbnails', 'table');
      table.clear();
      if (this.chart !== undefined)
      {
        this.chart.destroy();
      }
    }

  }

  function dateFromOffset(off) {
    return new Date((new Date()).getTime() - off*24*60*60*1000);
  }

  function dateFromHourOffset(off) {
    return new Date((new Date()).getTime() - off*60*60*1000);
  }

  function dateToMySql(d) {
    return d.getFullYear() + '-' + (parseInt(d.getMonth()) + 1) + '-' + d.getDate() + " " + 
    d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  }

  function getMousePosition(id, e) {
    let canvas = document.getElementById(id);
    let rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }
  function drawRefrenceLineAndCounts(pos, counts)
  {
    let canvas = document.getElementById("id-trail-analyzer");
    let context = canvas.getContext('2d');

    context.font = '10pt Calibri';
    context.fillStyle = 'black';
    context.fillText(" u: " + counts.up + " d: " + counts.down + " l: " + counts.left + " r: " + counts.right, pos.x + 5, pos.y -5);

    //draw v ref line 
    context.beginPath();         
    context.strokeStyle = "#BFC9CA";
    context.lineWidth = 1;
    context.setLineDash([5, 3]);
    context.moveTo(pos.x, 0);
    context.lineTo(pos.x, canvas.height);
    context.stroke();
    //draw h ref line
    context.beginPath();
    context.strokeStyle = "#BFC9CA";
    context.lineWidth = 1;
    context.setLineDash([5, 3]);
    context.moveTo(0, pos.y);
    context.lineTo(canvas.width, pos.y);
    context.stroke();
  }

  function OnClickDeleteTrail()
  {
    let cid = $('#id-report-cam').data('select').val();
    let inv = $('#id-report-int').data('select').val();
    let tlen = $('#id-report-trail-length').data('select').val();
  
    if (!isDefined(cid) || 
        !isDefined(inv)) {
      show_error("Please select the camera and an interval");
      return;
    }
  
    let ok = confirm("This would delete trails from the selected range. Proceed ?");
  
    if (!ok) {
      show_error("Trail delete operation cancelled");
      return;
    }
  
    let report = new Report(cid, tlen);
    let range = report.getIntervalRange(inv);
  
    _crud(
      {
        action: 'DELETE',
        table: 'Trails',
        where: `cid = ${cid} and uid = ${uid} and ts between '${dateToMySql(range.start)}' and '${dateToMySql(range.end)}'`,
        rows: [{x: 'y'}]
      });
  } 
  function OnClickAnalyzeTrail()
  {
    let cid = $('#id-report-cam').data('select').val();
    let inv = $('#id-report-int').data('select').val();
    let tlen = $('#id-report-trail-length').data('select').val();

    if (!isDefined(cid) || 
        !isDefined(inv)) {
      show_error("Please select the camera and an interval");
      return;
    }

    if (report) 
    {
      report.close();
    }

    report = new Report(cid, inv, tlen);

    report.generate();
  }

  function OnClickTrailEdit()
  {
    alert("trail edit : what ?");
  }

  function OnClickTrailDelete()
  {
    var table = $('#id-table-thumbnails').data('table');
    let items = table.getSelectedItems();
  
    if (!items.length)
    {
      show_error("Please select a trails to delete");
      return;
    }

    let id = [];

    for (let i = 0; i < items.length; i++)
    {
      id.push(items[i][0]);
    }

    let ok = confirm("Are you sure you want to delete this trails ?");

    if (!ok)
    {
      show_error("Trail delete operation cancelled");
      return;
    }

    _crud(
      {
        action: 'DELETE',
        table: 'Trails',
        where: 'id IN (' + id.toString() + ')',
        rows: [{x: 'y'}]
      });

  }

