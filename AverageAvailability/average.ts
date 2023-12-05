import * as fs from 'fs';
import * as path from 'path'

interface RestaurantData{
    name: string
    percentage: number
}

function calculateRestaurant(restaurant: string, mealperiod: string)
{

}

function processFiles(): RestaurantData[]
{
    console.log("hi")
    const files = fs.readdirsync('./activity-data')
    let data: RestaurantData[] = []
    files.forEach((file) => {
        const filePath = path.join('./activity-data',file)
        console.log(filePath)
    })
    
    return data
}
console.log("hi")
processFiles()