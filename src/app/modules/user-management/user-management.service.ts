import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UserManagementService {
  constructor() {}


// Function to generate a random boolean value
getRandomBoolean() {
  return Math.random() < 0.5;
}
getRandomAlphanumericId(length: number): string {
  const alphanumericChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += alphanumericChars.charAt(
      Math.floor(Math.random() * alphanumericChars.length)
    );
  }
  return result;
}

getRandomOrder(n: number): number {
  return Math.floor(Math.random() * n) + 1;
}

levels: any = [
  "National",
  "Regional",
  "Council",
  "District Council",
  "Municipality",
  "Mega City",
];

lawRoles = [
  "Lawyer",
  "Inspector",
  "Attorney",
  "Legal Officer",
  "Secretary",
  "Deputy Secretary",
  "Engineer",
  "Administrator",
  "ICTO",
  "National Admin",
  "Developer",
  "Executive Secretary",
  "DS",
  "ES",
];

generateData = (number?: number): any[] => {
  // Sample data for generating names

  const roleDescriptions = [
    "A professional who practices law, provides legal advice, and represents clients in legal matters.",
    "An appointed or elected official who presides over court proceedings, interprets and applies the law, and makes legal decisions.",
    "A lawyer who is licensed to practice law and represents clients in legal matters, including advising on legal rights and responsibilities and representing them in court.",
    "A lawyer who provides legal advice and guidance to individuals or organizations, typically within a specific industry or sector.",
    "A person who supports and promotes the interests of others, often by speaking or acting on their behalf, especially in legal or political contexts.",
    "A person responsible for managing and overseeing the operations of an organization or department, including administrative tasks and decision-making.",
    "Stands for Information and Communication Technology Officer. A professional responsible for managing and implementing information technology systems and infrastructure.",
    "An administrator responsible for overseeing administrative functions at a national level, often within a government or large organization.",
    "A person who designs, builds, and maintains software applications or systems, typically using programming languages and development tools.",
  ];
  // Map roles and descriptions to an array of objects
  let roleDescriptionsMap: any = roleDescriptions.map((role, index) => {
    return { name: role, description: this.lawRoles[index] };
  });
  // Generating user objects
  const items = [];

  let n = number ?? 20;
  for (let i = 0; i < n; i++) {
    // const description =
    //   roleDescriptions[Math.floor(Math.random() * roleDescriptions.length)];

    const description =
      roleDescriptionsMap[
        Math.floor(Math.random() * roleDescriptionsMap.length)
      ];
    const level = this.levels[Math.floor(Math.random() * this.levels.length)];

    const status = this.getRandomBoolean();
    const id = this.getRandomAlphanumericId(50);
    const name =
      this.lawRoles[Math.floor(Math.random() * this.lawRoles.length)];

    const user = {
      id,
      name,
      description,
      status,
      level,
    };

    items.push(user);
  }
  return items;
};

// Function to generate a random Tanzanian mobile number
generateMobileNumber() {
  const tanzanianCodes = ["+255"];
  const operatorCodes = [
    "62",
    "67",
    "71",
    "74",
    "75",
    "76",
    "77",
    "78",
    "79",
  ];
  return (
    tanzanianCodes[0] +
    operatorCodes[Math.floor(Math.random() * operatorCodes.length)] +
    Math.random().toString().slice(2, 9)
  );
}

generateDataUsers = (number?: number): any[] => {
  // Sample data for generating names
  const firstNames = [
    "John",
    "Mary",
    "James",
    "Elizabeth",
    "Michael",
    "Jennifer",
    "William",
    "Linda",
    "David",
    "Susan",
  ];
  const middleNames = [
    "Robert",
    "Ann",
    "Lee",
    "Marie",
    "Joseph",
    "Michelle",
    "Thomas",
    "Jane",
    "Christopher",
    "Nicole",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Jones",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
  ];
  const lawRoles = [
    "Economist",
    "Inspector",
    "Agent Admin",
    "AGENT Accountant",
    "Engineer",
    "Administrator",
  ];

  // Generating user objects
  const items = [];

  let n = number ?? 20;
  for (let i = 0; i < n; i++) {
    const firstName =
      firstNames[Math.floor(Math.random() * firstNames.length)];
    const middleName =
      middleNames[Math.floor(Math.random() * middleNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const gender = Math.random() < 0.5 ? "Male" : "Female";
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const mobileNumber = this.generateMobileNumber();
    const activeStatus = this.getRandomBoolean();
    const locked = this.getRandomBoolean();
    const status = this.getRandomBoolean();
    const id = this.getRandomAlphanumericId(80);
    const role = lawRoles[Math.floor(Math.random() * lawRoles.length)];

    const user = {
      id,
      firstName,
      middleName,
      lastName,
      gender,
      email,
      mobileNumber,
      activeStatus,
      locked,
      status,
      role,
    };

    items.push(user);
  }
  return items;
};

generateDataMenus = (number?: number): any[] => {
  // Sample data for generating names
  const names = [
    "User Management",
    "Billing Management",
    "Laws Reviews",
    "Review Requisitions",
    "Amendment Requisitions",
    "Pending Bills",
    "Approved Laws",
    "Review Progress",
    "Completed Review Requisitions",
    "Menus",
    "Dashboard",
    "Roles",
  ];
  const icons = [
    " ri-home-line",
    " ri-store-fill",
    " ri-ancient-pavilion-fill",
    " ri-award-fill",
    " ri-medal-2-line",
    " ri-pie-chart-2-fill",
    " ri-briefcase-5-line",
    " ri-customer-service-2-fill",
    " ri-chat-3-fill",
    " ri-chat-settings-fill",
    " ri-database-2-line",
    " ri-battery-2-charge-fill",
  ];
  const categories = ["Application", "Settings"];

  // Generating user objects
  const items = [];

  let n = number ?? 20;
  for (let i = 0; i < n; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    const category =
      categories[Math.floor(Math.random() * categories.length)];
    const router = `/auths/${name.replace(" ", "-").toLowerCase()}`;
    const order = this.getRandomOrder(n);
    const id = this.getRandomAlphanumericId(80);

    const user = {
      id,
      name,
      icon,
      category,
      router,
      order,
    };

    items.push(user);
  }
  return items;
};
}




