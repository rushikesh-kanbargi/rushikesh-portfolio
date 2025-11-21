export const formatDate = (dateString: string, format: 'MM/YYYY' | 'MMM YYYY' | 'YYYY'): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    switch (format) {
        case 'YYYY':
            return year.toString();
        case 'MM/YYYY':
            return `${(month + 1).toString().padStart(2, '0')}/${year}`;
        case 'MMM YYYY':
        default:
            return `${months[month]} ${year}`;
    }
};
