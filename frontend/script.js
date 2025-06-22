

  let allData = []; // Store all fetched data
  let allDataLength = ['alok'];
  









      

    //fetch data from server and show on table

  
    
    async function fetchData(pageNo, limitNo) {

            //filter
            let page = pageNo || 1;
            let limit =limitNo || 10;
            const userFilter = document.getElementById('userFilter').value || '';
            const ipFilter = document.getElementById('ipFilter').value || '';
            const methodFilter = document.getElementById('methodFilter').value || '';
            const statusFilter = document.getElementById('statusFilter').value || '';
            const logTypeFilter = document.getElementById('logTypeFilter').value || '';
            const otherFilter = document.getElementById('otherFilter').value || '';

            const startTimestamp = document.getElementById('startTimestampFilter').value || '';
            const endTimestamp = document.getElementById('endTimestampFilter').value || '';
      

      try {
        const response = await fetch(`http://localhost:3000/api/fetchall?page=${page}&limit=${limit}&user=${userFilter}&logType=${logTypeFilter}&clientIp=${ipFilter}&methodStatus=${statusFilter}&method=${methodFilter}&other=${otherFilter}&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`);

        
        // const response = await fetch('http://localhost:3000/api/fetchall?page=2&limit=13&user=alok&logType=id=Arrayos&timestamp=2025-02-12T04:50:32+05:30&clientIp=103.01.01&methodStatus=TCP-miss/300&port=1257&method=Post&url=www.alok.com/yt/user&peer=DIRECT/127.0.0.1');
        responseData = await response.json();
        allData=responseData.data;
        allDataLength=responseData.pagination;
        console.log(allData);
        console.log(allDataLength);
        displayData(allData, allDataLength); // Display all data initially
      } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('tableBody').innerHTML = '<tr><td colspan="4">Error loading data</td></tr>';
      }
    }



    //map data in table
    function displayData(allData, allDataLength) {
      const tableHeader = document.getElementById('tableHeader');
      const tableBody = document.getElementById('tableBody');
      
      // Clear existing content
      tableHeader.innerHTML = '';
      tableBody.innerHTML = '';

      // Create table headers
      if (allData.length > 0) {
        const headers = ['logLevel', 'timestamp', 'logType', 'elapsedTime', 'bytes', 'user', 'clientIp', 'methodStatus', 'port', 'method', 'url', 'hierarchy', 'peer', 'other'];
        headers.forEach(header => {
          const th = document.createElement('th');
          th.textContent = header.charAt(0).toUpperCase() + header.slice(1);
          tableHeader.appendChild(th);
        });

        // Populate table rows with data
        allData.forEach(item => {
          const row = document.createElement('tr');
          headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = item[header] || 'N/A';
            row.appendChild(td);
          });
          tableBody.appendChild(row);
        });
        document.getElementById('entityNo').textContent = `Quantities : Total Items- ${allDataLength.totalItems}, Total Pages- ${allDataLength.totalPages}, Current Page- ${allDataLength.currentPage}`;





        //fetch top 5 user and send in bar graph
        const top5 = getTopUser(allData);
        console.log('top5: ', top5);
        generateBars(top5);
        



        methodChart(allData);
        statusChart(allData);
        logTypeChart(allData)

       





        

      } else {
        tableBody.innerHTML = '<tr><td colspan="4">No matching data found !</td></tr>';
      }
    }
















































          








 

  




      

      
      











       




        // Fetch the button by class name
        const applyFilter = document.querySelector('.applyFilter');
         // Add click event listener
         applyFilter.addEventListener('click', () => {
          // Function to run on click
          fetchData();
        });

         // Fetch the button by class name
         const resetFilter = document.querySelector('.resetFilter');
         // Add click event listener
         resetFilter.addEventListener('click', () => {
          // Function to run on click
                      document.getElementById('userFilter').value = '';
                      document.getElementById('ipFilter').value = '';
                      document.getElementById('methodFilter').value = '';
                      document.getElementById('statusFilter').value = '';
                      document.getElementById('logTypeFilter').value = '';
                      document.getElementById('otherFilter').value = '';
          
                      document.getElementById('startTimestampFilter').value = '';
                      document.getElementById('endTimestampFilter').value = '';

                      fetchData();
        });


        // Fetch the button by class name
        const previous = document.querySelector('.previous');
        // Add click event listener
        previous.addEventListener('click', () => {
          // Function to run on click
          let pageNo = allDataLength.currentPage;
          pageNo--;
          fetchData(pageNo);
          console.log(pageNo);

        });


         // Fetch the button by class name
         const next = document.querySelector('.next');
         // Add click event listener
         next.addEventListener('click', () => {
           // Function to run on click
           let pageNo = allDataLength.currentPage;
           pageNo++;
           fetchData(pageNo);
           console.log(pageNo);
 
         });
        


          // Fetch data when the page loads
          window.onload = fetchData;























      // pie chart methods
          function methodChart(params) {
          

        const getCount = params.filter(item => item.method.includes('Get'));
        const postCount = params.filter(item => item.method.includes('Post'));

         // Manual data input (modify labels and data as needed)
         const labels = ['Get', 'Post'];
         const piedata = [getCount.length, postCount.length]; // Number of occurrences for each label
 
         // Generate colors for pie slices
         function generateColors(count) {
             const colors = [];
             for (let i = 0; i < count; i++) {
                 const hue = (i * 360 / count) % 360;
                 colors.push(`hsl(${hue}, 70%, 80%)`);
             }
             return colors;
         }
 
         // Draw pie chart
         function drawPieChart(canvas, data, labels, colors) {
             const ctx = canvas.getContext('2d');
             const centerX = canvas.width / 2;
             const centerY = canvas.height / 2;
             const radius = Math.min(centerX, centerY) - 10;
             const total = data.reduce((sum, val) => sum + val, 0);
 
             let startAngle = 0;
             for (let i = 0; i < data.length; i++) {
                 const sliceAngle = (data[i] / total) * 2 * Math.PI;
                 ctx.beginPath();
                 ctx.moveTo(centerX, centerY);
                 ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
                 ctx.fillStyle = colors[i];
                 ctx.fill();
                 ctx.strokeStyle = '#ffffff';
                 ctx.lineWidth = 2;
                 ctx.stroke();
                 startAngle += sliceAngle;
             }
 
             // Add legend
             const legend = document.getElementById('legend');
             legend.innerHTML = '';
             labels.forEach((label, i) => {
                 const div = document.createElement('div');
                 div.className = 'legend-item';
                 div.innerHTML = `
                     <span class="legend-color" style="background-color: ${colors[i]}"></span>
                     ${label}: ${data[i]}
                 `;
                 legend.appendChild(div);
             });
         }
 
         // Draw chart with manual data
         const colors = generateColors(labels.length);
         const canvas = document.getElementById('myPieChart');
         drawPieChart(canvas, piedata, labels, colors);
 
          }
      //pie chrt methods





        //pie chart status codes
           function statusChart(params) {
          

            const _200 = params.filter(item => item.methodStatus.includes('200'));
            const _300 = params.filter(item => item.methodStatus.includes('300'));
            const _400 = params.filter(item => item.methodStatus.includes('400'));
            const _500 = params.filter(item => item.methodStatus.includes('500'));
    
             // Manual data input (modify labels and data as needed)
             const labels = ['200', '300', '400', '500'];
             const piedata = [_200.length, _300.length, _400.length, _500.length]; // Number of occurrences for each label
     
             // Generate colors for pie slices
             function generateColors(count) {
                 const colors = [];
                 for (let i = 0; i < count; i++) {
                     const hue = (i * 360 / count) % 360;
                     colors.push(`hsl(${hue}, 70%, 80%)`);
                 }
                 return colors;
             }
     
             // Draw pie chart
             function drawPieChart(canvas, data, labels, colors) {
                 const ctx = canvas.getContext('2d');
                 const centerX = canvas.width / 2;
                 const centerY = canvas.height / 2;
                 const radius = Math.min(centerX, centerY) - 10;
                 const total = data.reduce((sum, val) => sum + val, 0);
     
                 let startAngle = 0;
                 for (let i = 0; i < data.length; i++) {
                     const sliceAngle = (data[i] / total) * 2 * Math.PI;
                     ctx.beginPath();
                     ctx.moveTo(centerX, centerY);
                     ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
                     ctx.fillStyle = colors[i];
                     ctx.fill();
                     ctx.strokeStyle = '#ffffff';
                     ctx.lineWidth = 2;
                     ctx.stroke();
                     startAngle += sliceAngle;
                 }
     
                 // Add legend
                 const legend = document.getElementById('legendstatus');
                 legend.innerHTML = '';
                 labels.forEach((label, i) => {
                     const div = document.createElement('div');
                     div.className = 'legend-item';
                     div.innerHTML = `
                         <span class="legend-color" style="background-color: ${colors[i]}"></span>
                         ${label}: ${data[i]}
                     `;
                     legend.appendChild(div);
                 });
             }
     
             // Draw chart with manual data
             const colors = generateColors(labels.length);
             const canvas = document.getElementById('myPieChartstatus');
             drawPieChart(canvas, piedata, labels, colors);
     
              }
        //pie chrt log type




       // pie chart logTypeChart

       function logTypeChart(params) {
          

        const squidCount = params.filter(item => item.logType.includes('AN_SQUID_LOG'));
        const arrayosCount = params.filter(item => item.logType.includes('id=Arrayos'));

         // Manual data input (modify labels and data as needed)
         const labels = ['AN_SQUID_LOG', 'id=Arrayos'];
         const piedata = [squidCount.length, arrayosCount.length]; // Number of occurrences for each label
 
         // Generate colors for pie slices
         function generateColors(count) {
             const colors = [];
             for (let i = 0; i < count; i++) {
                 const hue = (i * 360 / count) % 360;
                 colors.push(`hsl(${hue}, 70%, 80%)`);
             }
             return colors;
         }
 
         // Draw pie chart
         function drawPieChart(canvas, data, labels, colors) {
             const ctx = canvas.getContext('2d');
             const centerX = canvas.width / 2;
             const centerY = canvas.height / 2;
             const radius = Math.min(centerX, centerY) - 10;
             const total = data.reduce((sum, val) => sum + val, 0);
 
             let startAngle = 0;
             for (let i = 0; i < data.length; i++) {
                 const sliceAngle = (data[i] / total) * 2 * Math.PI;
                 ctx.beginPath();
                 ctx.moveTo(centerX, centerY);
                 ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
                 ctx.fillStyle = colors[i];
                 ctx.fill();
                 ctx.strokeStyle = '#ffffff';
                 ctx.lineWidth = 2;
                 ctx.stroke();
                 startAngle += sliceAngle;
             }
 
             // Add legend
             const legend = document.getElementById('legendLogType');
             legend.innerHTML = '';
             labels.forEach((label, i) => {
                 const div = document.createElement('div');
                 div.className = 'legend-item';
                 div.innerHTML = `
                     <span class="legend-color" style="background-color: ${colors[i]}"></span>
                     ${label}: ${data[i]}
                 `;
                 legend.appendChild(div);
             });
         }
 
         // Draw chart with manual data
         const colors = generateColors(labels.length);
         const canvas = document.getElementById('myPieChartLogType');
         drawPieChart(canvas, piedata, labels, colors);
 
          }
      // pie chart logTypeChart











      //top 10 user extract based on no of events

      function getTopUser(data) {
        // Count frequency of each username
        const frequencyMap = data.reduce((acc, user) => {
          acc[user.user] = (acc[user.user] || 0) + 1;
          return acc;
        }, {});
      
        // Convert to array of objects
        const frequencyArray = Object.keys(frequencyMap).map(user => ({
          user,
          count: frequencyMap[user]
        }));
      
        // Sort by count (descending) and username (ascending) for ties, then take top 5
        return frequencyArray
          .sort((a, b) => {
            if(b.count != a.count){
              return b.count - a.count;
            }
            return a.user.localeCompare(b.user)
            })
          .slice(0, 5);
      }
      


        

        // Function to generate bars
        function generateBars(top5) {
          try {
            const data = [top5[0].count,top5[1].count,top5[2].count,top5[3].count];
            const labels = [top5[0].user,top5[1].user,top5[2].user,top5[3].user];

            const chart = document.getElementById('chart');
            chart.innerHTML = ''; // Clear previous bars

            // Scale factor for better visualization (multiply user numbers by 50 for height in pixels)
            const scale = 10;

            data.forEach((users, index) => {
                const height = users * scale; // Scale the user count to pixel height
                const barContainer = document.createElement('div');
                barContainer.className = 'bar-container';

                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.height = `${height}px`;
                bar.textContent = users; // Display the user count on the bar

                const label = document.createElement('div');
                label.className = 'label';
                label.textContent = labels[index]; // Add group label below the bar

                barContainer.appendChild(bar);
                barContainer.appendChild(label);
                chart.appendChild(barContainer);
            });
          } catch (error) {
            console.log(error);
            
          }

          // const data = [top5[0].count,top5[1].count,top5[2].count,top5[3].count];
            // const labels = [top5[0].user,top5[1].user,top5[2].user,top5[3].user];
          
          

        

        }


