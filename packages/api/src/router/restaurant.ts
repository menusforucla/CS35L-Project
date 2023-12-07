import { z } from "zod";

import { MealType } from "@menus-for-ucla/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const restaurantRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.restaurant.findMany({ orderBy: { id: "desc" } });
  }),

  byId: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    const mealType: MealType = getMealType();
    console.log(mealType);
    return ctx.prisma.restaurant.findUnique({
      where: { id: input },
      include: {
        menuSections: {
          where: { mealType: mealType },
          include: {
            menuItems: {
              include: {
                allergens: true,
                dietaryPreferences: true,
              },
            },
          },
        },
      },
    });
  }),
});

function getMealType(): MealType {
  // Get the current time in Los Angeles timezone
  const now = new Date().toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
  });

  // Convert the time to a Date object for easier comparison
  const currentTime = new Date(`1970-01-01T${now}`);

  // Define the time ranges for meals
  const breakfastStart = new Date("1970-01-01T00:00:00");
  const breakfastEnd = new Date("1970-01-01T10:00:00");
  const lunchStart = new Date("1970-01-01T10:00:00");
  const lunchEnd = new Date("1970-01-01T16:00:00");
  const dinnerStart = new Date("1970-01-01T16:00:00");
  const dinnerEnd = new Date("1970-01-01T24:00:00");

  // Check and print the current meal time
  if (currentTime >= breakfastStart && currentTime < breakfastEnd) {
    return MealType.BREAKFAST;
  } else if (currentTime >= lunchStart && currentTime < lunchEnd) {
    return MealType.LUNCH;
  } else if (
    (currentTime >= dinnerStart && currentTime < dinnerEnd) ||
    currentTime < breakfastStart
  ) {
    return MealType.DINNER;
  } else {
    return MealType.DINNER;
  }
}

// interface RestaurantData{
//   name: string
//   percentage: string
//   time: number
// }

// interface hourAverage{
//   hour: number
//   activityLevel: number
// }
// export const activityAverageRouter = createTRPCRouter({
//   byRestId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
//       const { diningHall } = input;
//       const mealType: MealType = getMealType()
//       const activityLevels = calculateAverage(diningHall, mealType)

//       return ctx.prisma.restaraunt.update({
//         where:{
//           name: diningHall
//         },
//         data: {
//           activityLevels: {
//             createMany: {
//               data: activityLevels
//             },
//           },
//         },
//       })
//     })
//   })

// function calculateAverage(restaurant: string, mealType: MealType)
// {
//   // converting from MealType to string because the old data processor process JSON files that uses strings as identification. Won't be needed anymore after
//   // we transition to using the database as the source
//   let meal: string
//   if (mealType == MealType.BREAKFAST)
//   {
//     meal = "Breakfast"
//   }
//   else if (mealType == MealType.LUNCH)
//   {
//     meal = "Lunch"
//   }
//   else{
//     meal = "Dinner"
//   }

//   //get the starting and ending hour of the meal period based on the restaurant and mealperiod
//   const key = restaurant + " " + meal
//   const hourMap = new Map<string, number[]>();
//   hourMap.set("BruinPlate Breakfast", [7,10])
//   hourMap.set("DeNeve Breakfast", [7,10])
//   hourMap.set("BruinPlate Lunch", [11,14])
//   hourMap.set("DeNeve Lunch", [11,15])
//   hourMap.set("BruinPlate Dinner", [7,10])
//   hourMap.set("DeNeve Dinner", [17,21])
//   hourMap.set("BruinPlate Dinner", [17,21])
//   hourMap.set("Epicuria Dinner", [17,21])
//   const hours = hourMap.get(key)
//   if (hours == undefined)
//   {
//       console.error("could not find that restaurant and meal period combination")
//       process.exit(1)
//   }

//   // the key number will be the hour, and the number array will contain 2 numbers, the first being the total number of entries, and the second being the total availability
//   const hoursTotal = new Map<number, number[]>()
//   for (let i = hours[0]; i <= hours[1]; i++)
//   {
//       hoursTotal.set(i, [0,0])
//   }

//   //change process files to whatever function that process data from the database and returns a list of RestaurantData
//   const allData:RestaurantData[] = processFiles()
//   allData.forEach((data)=>{
//       if (data.name == restaurant && data.time >= hours[0] && data.time <= hours[1])
//       {
//          hoursTotal.get(data.time)![0] += 1
//          hoursTotal.get(data.time)![1] += parseInt(data.percentage)
//       }
//   })

//   //calculating the average of each our based on total hours and total entries
//   const hoursAverage : hourAverage[] = [];
//   for (let i = hours[0]; i <= hours[1]; i++)
//   {
//       //if no entries activity level = -1 to indicate error
//       if (hoursTotal.get(i)![0] == -1)
//       {
//           hoursAverage.push({hour: i,activityLevel: -1})
//       }
//       else
//       {
//           hoursAverage.push({hour:i, activityLevel: hoursTotal.get(i)![1]/hoursTotal.get(i)![0]})
//       }
//   }
//   return hoursAverage;
//   console.log(hoursAverage)
// }

// function processFiles(): RestaurantData[]
// {

//   const files = fs.readdirSync('../../scraper/activity-data')
//   let data: RestaurantData[] = []
//   files.forEach((file) => {
//       const filePath = path.join('../../scraper/activity-data',file)
//       if (fs.statSync(filePath).isFile() && path.extname(filePath) === '.json'){
//           const fileContent = fs.readFileSync(filePath, 'utf-8')
//           const jsonData : RestaurantData[] = JSON.parse(fileContent)
//           const hour = `${file[11]}${file[12]}`
//           jsonData.forEach((t) =>{
//               t.time = parseInt(hour)
//               t.name = t.name.split(' ').join('')
//           })

//           data = data.concat(jsonData)
//       }

//   })

//   return data
// }
// const args = process.argv.slice(2)
// if (args.length != 2) {
//   console.error('Please provide exactly two arguments, first being restaurant name, second being meal period.');
// }
// calculateAverage(args[0], args[1])
