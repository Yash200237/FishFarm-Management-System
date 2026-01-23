import type { Issue } from "../types/error";

export function ErrorMessage( issue : Issue) {
        const field = issue.path[0];
        const message = issue.message;
        if (field == "Name") return (message);
        if (field == "Email") return (message);
        if (field == "Password") return (message);
        if (field == "UserName") return (message);
        if (field == "ConfirmPassword") return (message);
        if (field == "UserRole") return ("Invalid user role");

        if (field == "Longitude") return ("Longitude should be between -180 and 180");
        if (field == "Latitude") return ("Latitude should be between -90 and 90");
        if (field == "NoOfCages") return ("Number of Cages should be a positive integer");
        if (field == "Picture") return ("Invalid picture");
        if (field == "Phone") return (message);
        if (field == "Description") return (message);
        if (field == "Logo") return ("Invalid logo image");

        if (field == "Age") return ("Age should be a positive integer");

        return message;
};

