# Journey Planner - How to plan your travel around London

![Design preview for the Interactive rating component coding challenge](./images/desktop-preview.png)

## Welcome! 👋

Thanks for checking out this project based on the Transport for London API.

### The Project

Users should be able to:

- Enter a start point of their journey
- Enter a destination point of their journey
- Click the search button
- Render results on how a user would get to their journey with instructions

### Links

- Solution URL: (https://github.com/clivepato93/journeyPlanner)
- Live Site URL: (https://clivepato93.github.io/journeyPlanner/)


## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Mobile-first workflow
- JS

### What I learned

I learned how to retrieve information from a complex API as it contained many objects with arrays etc.

```js

    // Functions to get time in 24hr format
    const getHour = (date) => `${new Date(date).getHours()}`.padStart(2,0);
    const getMinutes = (date) => `${new Date(date).getMinutes()}`.padStart(2,0);
    // Price of travel
    const getPrice = (value) => `${value}`.slice(0,-2)+'.'+`${value}`.slice(-2);

    const res = await fetch(link)
      
    const data = await res.json();

    if(!res.ok) throw new Error(`Please check the locations are valid`)


    let {journeys,journeyVector:{to}} = data

      const trips =  journeys.map(journey => {
         const depatureHours = getHour(journey.startDateTime);
         const depatureMinutes = getMinutes(journey.startDateTime);
         const arrivalHours = getHour(journey.arrivalDateTime);
         const arrivalMinutes = getMinutes(journey.arrivalDateTime);
         const totalFare = journey.fare?+getPrice(journey.fare.totalCost):0;
         const totalString = journey.fare?getPrice(journey.fare.totalCost):0;

        //  Destructing of each journey generally there are 3/4 journeys to destruct
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
      
            instruct = {
               duration:instruct.duration,
                // important part of the destruct if the instruct.mode.name=='walking' then the markup will be different to bus or train/overground etc    
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
```