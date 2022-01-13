export interface User {
    id: string,
    email: string,
    favorites: Favorite[],
    applications: Application[]
}

export interface Favorite {
    school: CSC_School
}

export interface Application {
    id: string,
    program: string,
    deadline: Date,
    school: CSC_School,
    files: any,
    notes: Note[],
}

export interface Note {
    id: string,
    text: string
}

/** Gov. data model - minified */
export interface CSC_School {
    school: {
        zip: string,
        city: string,
        name: string,
        state: string,
        accreditor: string,
        school_url: string,
        accreditor_code: string,
        price_calculator_url: string,
    },
    programs: CSC_Program[]
}

export interface CSC_Program {
    cip_4_digit: string,
    title: string,
    school: {
        name: string,
        type: string,
    },
    credential: {
        title: string
    },
}
/** Gov. data model - minified END */

export interface State {
    STATE: string,
    SHORT: string
}

/** DEPRECATED */
export interface College {
    OBJECTID: number,
    NAME: string,
    STREET: string,
    CITY: string,
    STATE: string,
    ZIP: number,
    COUNTY: string,
    LAT: number,
    LON: number
}

export interface Major {
    MAJOR: string,
    CATEGORY: string
}