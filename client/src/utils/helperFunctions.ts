export const getInitials = (name: string = "John Doe"): string => {
    const words = name.trim().split(" ");
    if (words.length === 0) return "";
    const first = words[0].charAt(0);
    const last = words[words.length - 1].charAt(0);
    return (first + last).toUpperCase();
};

export const capitalise = (val: string): string => {
    return val.substring(0, 1).toUpperCase() + val.substring(1);
}