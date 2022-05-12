const url = 'https://api.tfl.gov.uk/Journey/JourneyResults/EC1V9NQ/to/WC2H7NA?date=20220509&time=2043&timeIs=Departing&journeyPreference=LeastInterchange&accessibilityPreference=NoRequirements&walkingSpeed=Slow&cyclePreference=None&bikeProficiency=Easy';
const url2 = 'https://api.tfl.gov.uk/Journey/JourneyResults/EC1V 9NQ/to/WC2H7NA';
const url3 = 'https://api.tfl.gov.uk/Journey/JourneyResults/EC1V9NQ/to/WC2H7NA?date=20220510&time=1158&timeIs=Departing&journeyPreference=LeastInterchange&accessibilityPreference=NoRequirements&walkingSpeed=Slow&cyclePreference=None&bikeProficiency=Easy';
const url4 = 'https://api.tfl.gov.uk/Journey/JourneyResults/EC1V9NQ/to/N170BX?date=20220510&time=1100&timeIs=Departing&journeyPreference=LeastInterchange&accessibilityPreference=NoRequirements&walkingSpeed=Slow&cyclePreference=None&bikeProficiency=Easy';
const url5 = 'https://api.tfl.gov.uk/Journey/JourneyResults/EC1V9NQ/to/SE256PU';
const resultsContainer = document.querySelector('.results');
// Functions to get time in 24hr format
const getHour = (date) => `${new Date(date).getHours()}`.padStart(2,0);
const getMinutes = (date) => `${new Date(date).getMinutes()}`.padStart(2,0);
// Price of travel
const getPrice = (value) => +(`${value}`.slice(0,-2)+'.'+`${value}`.slice(-2))
const btn = document.querySelector('.sub');

const startLocationfield = document.querySelector(".startAddress");
const arrivalLocationfield = document.querySelector(".arrivalAddress");

btn.addEventListener('click',function(e){
   e.preventDefault();
   // if(!startLocationfield.textContent||!arrivalLocationfield.textContent){
   //    alert('💩')
   // }

   // else{
      // loadJourney(`https://api.tfl.gov.uk/Journey/JourneyResults/${startLocationfield.textContent}/to/${arrivalLocationfield.textContent}`)
   // }
})


// window.addEventListener('resize',function () {
//    console.log(window.innerWidth) 
// } )


const renderInstructionMarkup = (journey)=>{
   
   const markUpHeading = 
   `
   <div class="result">
      <div class="header">
         <section class="title">
            <h1 class="sectionTitle">Journey to ${journey.destination}</h1>
            <div class="times">
               <h2>
                  <span class="depature-time">${journey.departureTime}</span> to 
                  <span class="arrival-time">${journey.arrivalTime}</span>
               </h2>
               <div class="total-time">
               <h2 class="duration"><span class="figure">${journey.duration}</span>mins</h2>
               </div>
            </div>
         </section>
      <div class="fare-info">
       <h2 class="fare-cost">${journey.totalCost?'£':''}<span class="figure">${journey.totalCost?journey.totalCost:''}
      </span></h2>
      </div>
      </div>
   
   `

   const journeysMarkup = journey.instructions.map(journey=>{
      // using later
      const instruction = `
      <div class="instruction">
         <div class="instruction-title">
            <h2>
               <span class="mode">${!journey.mode.includes('walk')?journey.mode:''} </span>
               <span class="detailed">${journey.detailed} </span>
               <span class="detailed">${journey.stopsString}</h2>
               </div>
            <div class="start-point">
                <h3 class="duration"><span class="figure">${journey.departureName} ${journey.departureplatformStopName} </span></h3>
            </div>
         <ul class="steps">
            <div class="times">
               <h3>
                  <span class="depature-time">${journey.departureTime}</span>
                   to <span class="arrival-time">${journey.arrivalTime}</span>
               </h3>
                 <div class="total-time">
                     <h3 class="duration"><span class="figure">${journey.duration} </span>mins</h3>
                 </div>
            </div>       
      `

      let info;
      if(journey.mode == 'walk'){
         info = journey.steps.map(step=>{
            return `
                  <li class="direction">
                     <span class="descriptionHeading">${step.descriptionHeading}</span>
                     <span class="description">${step.description}</span>
                  </li>
                  ` 
         }).join('\n')
      }

      else{
         info = journey.stops.map(stop=>{
            return `
                  <li class="direction">
                     <span class="descriptionHeading">${stop.name}</span>
                     <span class="description"></span>
                  </li>
                  ` 
         }).join('')
      }

      return instruction+info+'</ul></div>'
      // return instruction
            
   }).join('\n')
   // const instructions = journey.s
   // console.log(markUpHeading + journeysMarkup + '</div>')
   return markUpHeading + journeysMarkup + '</div>'
   // return markUpHeading
}

const loadJourney = async function(link){
   try{
      const res = await fetch(link)
      
      const data = await res.json();

      if(!res.ok) throw new Error(`Please check the locations are valid`)
      console.log(res,data)

      let {journeys,journeyVector:{to}} = data

      const trips =  journeys.map(journey => {
         const depatureHours = getHour(journey.startDateTime);
         const depatureMinutes = getMinutes(journey.startDateTime);
         const arrivalHours = getHour(journey.arrivalDateTime);
         const arrivalMinutes = getMinutes(journey.arrivalDateTime);
         const totalFare = journey.fare?getPrice(journey.fare.totalCost):0;
         // console.log(journey)

         journey = {
            destination:to,
            instructions:journey.legs,
            departureTime: `${depatureHours}:${depatureMinutes}`,
            arrivalTime:`${arrivalHours}:${arrivalMinutes}`,
            duration:journey.duration,
            totalCost:totalFare,
         }

         // console.log(journey)

         journey.instructions = journey.instructions.map((instruct,i)=>{
      
            // console.log(instruct)
            instruct = {
               duration:instruct.duration,
               mode:instruct.mode.name=='walking'?'walk':`Get the ${instruct.mode.name}`,
               instructions:instruct.instruction,
               departureTime: `${getHour(instruct.departureTime)}:${getMinutes(instruct.departureTime)}`,
               arrivalTime: `${getHour(instruct.arrivalTime)}:${getMinutes(instruct.arrivalTime)}`,
               detailed:instruct.instruction.detailed,
               steps:instruct.instruction.steps,
               stops:instruct.path.stopPoints,
               stopsString: instruct.path.stopPoints.length && instruct.mode.name!='walking' ?
               `(${instruct.path.stopPoints.length} stop${instruct.path.stopPoints.length==1?'':'s'})`: '',
               departureName:instruct.mode.name=='bus'?instruct.departurePoint.platformName:'',
               departureName:instruct.mode.name!='walking'?`The departure point is ${instruct.departurePoint.commonName}`:'',
               departureplatformName:instruct.mode.name=='bus'?instruct.departurePoint.platformName:'',
               departureplatformStopName:instruct.mode.name=='bus'?`& the depature stop is ${instruct.departurePoint.stopLetter}`:'',
               arrivalplatformName:instruct.mode.name=='bus'?instruct.arrivalPoint.platformName:'',
               arrivalplatformStop:instruct.mode.name=='bus'?instruct.arrivalPoint.stopLetter:'',
            } 

   
   
         return instruct
   
               })

         return journey
      })

      console.log(trips)
// console.log(test)
      
      // how each one should be broken down
      // let firstJourney = journeys[0];
      // console.log( journeys[0],to);
      // const depatureHours = getHour(firstJourney.startDateTime);
      // const depatureMinutes = getMinutes(firstJourney.startDateTime);
      // const arrivalHours = getHour(firstJourney.arrivalDateTime);
      // const arrivalMinutes = getMinutes(firstJourney.arrivalDateTime);
      // const totalFare = firstJourney.fare?getPrice(firstJourney.fare.totalCost):0;
      // console.log(totalCost)


      // firstJourney = {
      //       destination:to,
      //       instructions:firstJourney.legs,
      //       depatureTime: `${depatureHours}:${depatureMinutes}`,
      //       arrivalTime:`${arrivalHours}:${arrivalMinutes}`,
      //       duration:firstJourney.duration,
      //       totalCost:totalFare,
      //    }


      // return an array of instructions
      // const instructions = firstJourney.instructions.map((instruct,i)=>{

      //    let direction = instruct;
      //    direction = {
      //       duration:direction.duration,
      //       mode:direction.mode.name=='walking'?'walk':`Get the ${direction.mode.name}`,
      //       instructions:direction.instruction,
      //       departureTime: `${getHour(direction.departureTime)}:${getMinutes(direction.departureTime)}`,
      //       arrivalTime: `${getHour(direction.arrivalTime)}:${getMinutes(direction.arrivalTime)}`,
      //       detailed:direction.instruction.detailed,
      //       steps:direction.instruction.steps,
      //    } 
      //    direction.stops = !direction.mode.includes('walk')?instruct.path.stopPoints:'';


      // return direction

      //       })


      // console.log(instructions)

      const testingMarkup = trips.map(trip=> renderInstructionMarkup(trip))

      // const testingMarkup = trips.slice(0,2).map(trip=> renderInstructionMarkup(trip))

      // const testingMarkup = trips.slice(0,2).map(trip=> renderInstructionMarkup(trip))
      // const testingMarkup = renderInstructionMarkup( trips[0])
      // testingMarkup.join('')
      // console.log(testingMarkup.join(' '))

      // const markup = 
      // `
      // <div class="result">
      // <div class="header">
      // <section class="title">
      //    <h1 class="sectionTitle">Journey to ${firstJourney.destination}</h1>
      //    <div class="times">
      //       <h3>
      //       <span class="depature-time">${firstJourney.depatureTime}</span> to 
      //       <span class="arrival-time">${firstJourney.arrivalTime}</span>
      //       </h3>
      //       <div class="total-time">
      //       <h3 class="duration"><span class="figure">${firstJourney.duration}</span>mins</h2>
      //       </div>
      //    </div>
      // </section>
      // <div class="fare-info">
      //    <h4 class="fare-cost">£<span class="figure">${firstJourney.totalCost}</span></h4>
      // </div>
      // </div>
      // ${testingMarkup.join(' ')}
      // </div> 
      // `      
      resultsContainer.innerHTML = '';
      resultsContainer.insertAdjacentHTML('afterbegin',testingMarkup.join('\n'));
   }
   catch(err){
      console.log(err)
      const testingMarkup = 
      `
      <div class="result">
      <div class="header">
      ${err}
      </div>
      </div>
      `
      resultsContainer.innerHTML = '';
      resultsContainer.insertAdjacentHTML('afterbegin',testingMarkup);
   }
}


// loadJourney();

btn.addEventListener('click',function(e){
   e.preventDefault();
   // if(!startLocationfield.textContent||!arrivalLocationfield.textContent){
   //    alert('💩')
   // }

   // console.log(startLocationfield.textContent,arrivalLocationfield.textContent)

   // else{
      loadJourney(`https://api.tfl.gov.uk/Journey/JourneyResults/${startLocationfield.value}/to/${arrivalLocationfield.value}`)
   // }
})