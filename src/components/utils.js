export const extractDate = dateString => {
    try {
        // Create a Date object from the input string
        const dateObj = new Date(dateString);

        // Extract the year component from the Date object
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const date = dateObj.getDate();

        return { year, month, date };
    } catch (error) {
        // Handle any parsing errors
        console.error("Error parsing date:", error);
        return null;
    }
}


