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
const getPrice = (value) => `${value}`.slice(0,-2)+'.'+`${value}`.slice(-2);



// click event
const btn = document.querySelector('.sub');

//address fields
const startLocationfield = document.querySelector(".startAddress");
const arrivalLocationfield = document.querySelector(".arrivalAddress");
// address strings
let startPoint;
let endPoint;

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
                  <span class="figure">${journey.duration}</span>mins
               </h2>
            </div>
         </section>
      <div class="fare-info">
       <h2 class="fare-cost">${journey.totalCost?'£':''}<span class="figure">${journey.totalCost?journey.totalString:''}
      </span></h2>
      </div>
      </div>
   
   `

   const journeysMarkup = journey.instructions.map(journey=>{
      // using later
      const instruction = `
      <div class="instruction">
         <div class="instruction-title">
            
            <h2 class="mode">${!journey.mode.includes('walk')?journey.mode:''}</h2>
            <h2 class="detailed">${journey.detailed} </h2>
            <h2 class="detailed">${journey.stopsString}</h2>
               </div>
            <div class="start-point">
                <h2 class="duration"><span class="figure">${journey.departureName} ${journey.departureplatformStopName} </span></h2>
            </div>
         <ul class="steps">
            <div class="times">
               <h2>
                  <span class="depature-time">${journey.departureTime}</span>
                   to <span class="arrival-time">${journey.arrivalTime}</span>
                   <span class="figure">${journey.duration} mins</span>
               </h2>
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

            
   }).join('\n')


   return markUpHeading + journeysMarkup + '</div>'

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
         const totalFare = journey.fare?+getPrice(journey.fare.totalCost):0;
         const totalString = journey.fare?getPrice(journey.fare.totalCost):0;

         journey = {
            destination:to,
            instructions:journey.legs,
            departureTime: `${depatureHours}:${depatureMinutes}`,
            arrivalTime:`${arrivalHours}:${arrivalMinutes}`,
            duration:journey.duration,
            totalCost:totalFare,
            totalString:totalString
         }



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

      const testingMarkup = trips.map(trip=> renderInstructionMarkup(trip))
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

   startPoint = startLocationfield.textContent;
   endPoint = arrivalLocationfield.textContent;
   if(!startLocationfield.textContent||!arrivalLocationfield.textContent){
      loadJourney(`https://api.tfl.gov.uk/Journey/JourneyResults/${startLocationfield.value}/to/${arrivalLocationfield.value}`)

   }

   // console.log(startLocationfield.textContent,arrivalLocationfield.textContent)

   else{
      loadJourney(`https://api.tfl.gov.uk/Journey/JourneyResults/${startLocationfield.value}/to/${arrivalLocationfield.value}`)
   }
})