import * as fs from 'fs';
import * as path from 'path'

interface RestaurantData{
    name: string
    percentage: string
    time: number
}

interface hourAverage{
    hour: number
    average: number
}
function calculateAverage(restaurant: string, mealperiod: string)
{
    const key = restaurant + " " + mealperiod
    const hourMap = new Map<string, number[]>();
    hourMap.set("BruinPlate Breakfast", [7,10])
    hourMap.set("DeNeve Breakfast", [7,10])
    hourMap.set("BruinPlate Lunch", [11,14])
    hourMap.set("DeNeve Lunch", [11,15])
    hourMap.set("BruinPlate Dinner", [7,10])
    hourMap.set("DeNeve Dinner", [17,21])
    hourMap.set("BruinPlate Dinner", [17,21])
    hourMap.set("Epicuria Dinner", [17,21])
    const hours = hourMap.get(key)
    if (hours == undefined)
    {
        console.error("could not find that restaurant and meal period combination")
        process.exit(1)
    }
   
    // the key number will be the hour, and the number array will contain 2 numbers, the first being the total number of entries, and the second being the total availability
    const hoursTotal = new Map<number, number[]>()
    for (let i = hours[0]; i <= hours[1]; i++)
    {
        hoursTotal.set(i, [0,0])
    }
    const allData:RestaurantData[] = processFiles()
    allData.forEach((data)=>{
        if (data.name == restaurant && data.time >= hours[0] && data.time <= hours[1])
        {
           hoursTotal.get(data.time)![0] += 1
           hoursTotal.get(data.time)![1] += parseInt(data.percentage)
        }
    })
    const hoursAverage: hourAverage[] = []
    for (let i = hours[0]; i <= hours[1]; i++)
    {
        if (hoursTotal.get(i)![0] == -1)
        {
            hoursAverage.push({hour: i, average: -1})
        }
        else
        {
            hoursAverage.push({hour : i, average: hoursTotal.get(i)![1]/hoursTotal.get(i)![0]})
        }
    }
    console.log(hoursAverage)
}

function processFiles(): RestaurantData[]
{
    
    const files = fs.readdirSync('./activity-data')
    let data: RestaurantData[] = []
    files.forEach((file) => {
        const filePath = path.join('./activity-data',file)
        if (fs.statSync(filePath).isFile() && path.extname(filePath) === '.json'){
            const fileContent = fs.readFileSync(filePath, 'utf-8')
            const jsonData : RestaurantData[] = JSON.parse(fileContent)
            const hour = `${file[11]}${file[12]}`
            jsonData.forEach((t) =>{
                t.time = parseInt(hour)
                t.name = t.name.split(' ').join('')
            })
            
            data = data.concat(jsonData)
        }
        
    })
    
    return data
}
const args = process.argv.slice(2)
if (args.length != 2) {
    console.error('Please provide exactly two arguments, first being restaurant name, second being meal period.');
  }
calculateAverage(args[0], args[1])