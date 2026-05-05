const User = require('../userModel');

const generateBadgeNumber = async () =>{
    // Get the current year
    const year = new Date().getFullYear();
    const prefix=`OFF-${year}`;

    //Find the last badge number for the current year
    const lastOfficer = await User.findOne({
        badgeNumber: { $regex: `^${prefix}` },
    }).sort({ badgeNumber: -1 }); // Sort descending

    let nextNumber = 1;
    if(lastOfficer && lastOfficer.badgeNumber) {
        const lastBadgeNumber = lastOfficer.badgeNumber;
        const lastNumber = parseInt(lastBadgeNumber.split('-')[2], 10);
        nextNumber = lastNumber + 1;
    }
    // pad with zeros 1 -> 001
    const paddedNumber = String(nextNumber).padStart(3 , '0');
    return `${prefix}-${paddedNumber}`
};

module.exports = generateBadgeNumber;