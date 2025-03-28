// src/modules/import/interfaces/mech-csv.interface.ts
export interface RawMechCsvRecord {
    DBID: string;
    'Name/Model': string;
    'Unit Type': string;
    Technology: string;
    Chassis: string;
    Era: string;
    Year: string;
    'Rules Level (Era)': string;
    Tonnage: string;
    'Battle Value': string;
    'Point Value': string;
    Cost: string;
    Rating: string;
    Designer: string;
  }