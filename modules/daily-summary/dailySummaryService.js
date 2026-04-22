const dailySummaryModel = require('./dailySummaryModel');
const settingsModel = require('../../shared/models/settingsModel');
const ldrModel = require('../sensors/ldr/ldrModel');
const dht11Model = require('../sensors/dht11/dht11Model');
const bmp180Model = require('../sensors/bmp180/bmp180Model');
const mq135Model = require('../sensors/mq135/mq135Model');

let todaySummaryCashe = null;
let lastCasheTime = 0;

const getCachedTodaySummary = async () => {
    const now = Date.now();
    if(!todaySummaryCashe || now-lastCasheTime > 30_000){
        todaySummaryCashe=await exports.getTodaySummary();
        lastCasheTime=now;
    }
    return todaySummaryCashe;
}

const saveSensorSummary = async (sensorType, sensorId, date, avgPower, totalEnergy, totalCost) => {
    await dailySummaryModel.findOneAndUpdate(
        { sensor_id: sensorId, date: date },
        {
            $set: {
                sensor_type: sensorType,
                sensor_id: sensorId,
                date: date,
                power: avgPower,
                total_energy: totalEnergy,
                total_cost: totalCost
            }
        },
        { upsert: true, new: true }
    );
};

const calculateSensorData = async (model, sensorId, startTime, endTime, costPerKwh) => {
    const readings = await model.aggregate([
        {
            $match: {
                sensor_id: sensorId,
                timestamp: { $gte: startTime, $lt: endTime }
            }
        },
        {
            $sort:{
                timestamp: -1
            }
        },
        {
            $group: {
                _id: "$sensor_id",
                status: { $first: "$status" },
                active_power: { $first: "$power" },
                avg_power: { $avg: "$power" }
            }
        }
    ]);
    let activePower = 0;
    if(readings[0]?.status == 'OFF' || readings[0]?.status == 'FAULTY'){
        activePower = 0;  
    }
    else{
        activePower = readings[0]?.active_power || 0;
    }
    const avgPower = readings[0]?.avg_power || 0;
    const hours = (endTime - startTime) / (1000 * 60 * 60);
    const energy = avgPower * hours / 1000;
    const cost = energy * costPerKwh;
    return { activePower, avgPower, energy, cost};
}

const loopThroughSensorIds = async (model, startTime, endTime, costPerKwh, save) => {
    const sensorIds = await model.distinct('sensor_id');

    let totalActivePower = 0;
    let totalEnergy = 0;
    let totalCost = 0;
    let totalAvgPower = 0;

    // Run all sensors in parallel
    const results = await Promise.all(
        sensorIds.map(sensorId => calculateSensorData(model, sensorId, startTime, endTime, costPerKwh)
            .then(result => ({ sensorId, ...result })) // include sensorId
        )
    );

    // Process results
    for (const result of results) {
        if(save){
            await saveSensorSummary(model.modelName, result.sensorId, startTime, result.avgPower, result.energy, result.cost);
        }
        totalActivePower += result.activePower;
        totalEnergy += result.energy;
        totalCost += result.cost;
        totalAvgPower += result.avgPower;
    }

    return { totalActivePower, totalEnergy, totalCost, totalAvgPower };
}

const calculateChange = (todayValue, yesterdayValue) => {
    if(!yesterdayValue && todayValue !== 0) return 100; // To avoid division by zero
    if(todayValue === 0 && yesterdayValue === 0) return 0; // No change if both are zero
    return ((todayValue - yesterdayValue) / yesterdayValue) * 100;
}

exports.getDailySummary = async () => {
    //Get Yesterday's date at 00:00:00 hours - Start of the day-
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    //Get today's date at 00:00:00 hours - Start of the day-
    const today= new Date();
    today.setHours(0, 0, 0, 0);

    // Get cost per kWh from settings
    const settings = await settingsModel.findOne();
    const costPerKwh = settings ? settings.cost_per_kwh : 1.5;

    await Promise.all([
            loopThroughSensorIds(dht11Model, yesterday, today, costPerKwh , true),
            loopThroughSensorIds(bmp180Model, yesterday, today, costPerKwh , true),
            loopThroughSensorIds(mq135Model, yesterday, today, costPerKwh , true),
            loopThroughSensorIds(ldrModel, yesterday, today, costPerKwh , true),
            loopThroughSensorIds(flameModel, yesterday, today, costPerKwh , true)
    ]);
 }  

exports.getWeeklyConsumption = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklySummary = await dailySummaryModel.aggregate([
        {
            $match: {
                date: {
                    $gte: sevenDaysAgo
                }
            }
        },
        {
            $group: {
                _id : {
                    $dateToString: { format: "%Y-%m-%d", date: "$date" }
                },
                total_energy: { $sum: "$total_energy" },
                total_cost: { $sum: "$total_cost" }
            }
        },
        {
            $sort: { 
                _id:  1  //By date in ascending order
            }
        },
        {
            $project: {
                _id: 0,
                date: '$_id',
                total_energy: 1,
                total_cost: 1
            }
        }
    ]);

    // Convert the array to a map for easier access by date
    const dataMap = {};
    weeklySummary.forEach(day => {
        dataMap[day.date]= day
    });

    //Fill in missing dates with zero values
    const result=[];
    for(let i=6 ; i>=0 ; i--){
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        result.push(dataMap[dateStr] ? {
            date: dataMap[dateStr].date,
            total_energy: parseFloat(dataMap[dateStr].total_energy.toFixed(2)),
            total_cost: parseFloat(dataMap[dateStr].total_cost.toFixed(2))
            } : {
            date: dateStr,
            total_energy: 0,
            total_cost: 0
            });
    }
    //GET Today's data as they are not in the daily summary collection yet
    const todaySummary = await getCachedTodaySummary();
    const todayDateStr = new Date().toISOString().split('T')[0];
    if(result[result.length - 1].date === todayDateStr){
        result[result.length - 1].total_energy = todaySummary.totalEnergy;
        result[result.length - 1].total_cost = todaySummary.totalCost;
    }

    const maxDay = result.reduce((max, day) => day.total_energy > max.total_energy ? day : max, result[0]);
    return {
        weeklyData: result,
        maxDay: {
            date: maxDay.date,
            total_energy: parseFloat(maxDay.total_energy.toFixed(2)),
            total_cost: parseFloat(maxDay.total_cost.toFixed(2))
        }
    };
}

exports.getTodaySummary = async () =>{
    const today= new Date();
    today.setHours(0, 0, 0, 0);

    const liveTime= new Date();

    // Get cost per kWh from settings
    const settings = await settingsModel.findOne();
    const costPerKwh = settings ? settings.cost_per_kwh : 1.5; // default to 1.5 if not found

    const [
        ldrSummary,
        dht11Summary,
        bmp180Summary,
        mq135Summary,
        flameSummary
    ] = await Promise.all([
        loopThroughSensorIds(ldrModel, today, liveTime, costPerKwh , false),
        loopThroughSensorIds(dht11Model, today, liveTime, costPerKwh , false),
        loopThroughSensorIds(bmp180Model, today, liveTime, costPerKwh , false),
        loopThroughSensorIds(mq135Model, today, liveTime, costPerKwh , false),
        loopThroughSensorIds(flameModel, today, liveTime, costPerKwh , false)
    ]);

    return {
        date: liveTime.toISOString().split('T')[0],
        totalActiveLoad: parseFloat((ldrSummary.totalActivePower + dht11Summary.totalActivePower + bmp180Summary.totalActivePower + mq135Summary.totalActivePower + flameSummary.totalActivePower).toFixed(2)),
        totalEnergy: parseFloat((ldrSummary.totalEnergy + dht11Summary.totalEnergy + bmp180Summary.totalEnergy + mq135Summary.totalEnergy + flameSummary.totalEnergy).toFixed(2)),
        totalCost: parseFloat((ldrSummary.totalCost + dht11Summary.totalCost + bmp180Summary.totalCost + mq135Summary.totalCost + flameSummary.totalCost).toFixed(2)),
        totalAvgPower: parseFloat((ldrSummary.totalAvgPower + dht11Summary.totalAvgPower + bmp180Summary.totalAvgPower + mq135Summary.totalAvgPower + flameSummary.totalAvgPower).toFixed(2))
    }
}

exports.getDailyComparison = async () => {
    const today = await getCachedTodaySummary();
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    yesterdayDate.setHours(0, 0, 0, 0);
    const yesterday = await dailySummaryModel.aggregate([
        {
            $match: {
                date: {
                    $gte: yesterdayDate,
                    $lt: todayDate
                }
            }
        },
        {
            $group: {
                _id: null,
                total_energy: { $sum: "$total_energy" },
                total_cost: { $sum: "$total_cost" },
                total_avg_power: { $sum: "$power" }
            }
        }
    ]);
    const yesterdayData = yesterday[0] || {};
    const avgPowerChange = calculateChange(today.totalAvgPower, yesterdayData.total_avg_power || 0);
    const energyChange = calculateChange(today.totalEnergy, yesterdayData.total_energy || 0);
    const costChange = calculateChange(today.totalCost, yesterdayData.total_cost || 0);
    return {
        avgPowerPercentChange: parseFloat(avgPowerChange.toFixed(2)),
        avgPowerComment : (avgPowerChange > 0) ? 'HIGH' : (avgPowerChange < 0) ? 'LOW' : 'NORMAL',
        energyChangePercentChange: parseFloat(energyChange.toFixed(2)),
        energyChangeComment : (energyChange > 0) ? 'HIGH' : (energyChange < 0) ? 'LOW' : 'NORMAL',
        costChange: parseFloat(costChange.toFixed(2)),
        costChangeComment : (costChange > 0) ? 'HIGH' : (costChange < 0) ? 'LOW' : 'NORMAL'
    }
}