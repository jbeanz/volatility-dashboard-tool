
export const extractDate = dateString => {
    try {
        // Create a Date object from the input string
        const dateObj = new Date(dateString);

        // Extract the year component from the Date object
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const day = dateObj.getDate();
        const hour = dateObj.getHours()
        const minute = dateObj.getMinutes()
        const second = dateObj.getSeconds()
        const tooltipDate = dateObj.toLocaleString()
        return { year, month, day, hour, minute, second, tooltipDate };
    } catch (error) {
        // Handle any parsing errors
        console.error("Error parsing date:", error);
        return null;
    }
}

export function convertUnixTimestamp(unixTimestamp) {
    // Create a new Date object using the Unix timestamp (in milliseconds)
    const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds

    // Extract year, month, day, hour, and minute
    const priceYear = date.getFullYear();
    const priceMonth = date.getMonth() + 1; // Months are zero-based, so add 1
    const priceDay = date.getDate();
    const priceHour = date.getHours();
    const priceMinute = date.getMinutes();
    const priceSecond = date.getSeconds();

    return {
        priceYear,
        priceMonth,
        priceDay,
        priceHour,
        priceMinute,
        priceSecond
    };
}


