export interface Authorization {
    isAuthenticated: boolean,
    user: User
}

export interface AuthResponse {
    token: string,
    data: {
        id: string,
        email: string
    }
}

export interface User {
    id: string,
    email: string,
    favorites: Favorite[],
    applications: Application[]
}

export interface Favorite {
    id: string,
    school: any,
    programs: any
}

export interface Application {
    id: string,
    program: string,
    deadline: Date,
    status: string,
    application_fee: number,
    tuition: number,
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