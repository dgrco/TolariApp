export namespace main {
	
	export class AppSettings {
	    zoom: number;
	
	    static createFrom(source: any = {}) {
	        return new AppSettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.zoom = source["zoom"];
	    }
	}
	export class Flashcard {
	    id: number;
	    front: string;
	    back: string;
	    repetitions: number;
	    easiness: number;
	    interval: number;
	    review_date: string;
	
	    static createFrom(source: any = {}) {
	        return new Flashcard(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.front = source["front"];
	        this.back = source["back"];
	        this.repetitions = source["repetitions"];
	        this.easiness = source["easiness"];
	        this.interval = source["interval"];
	        this.review_date = source["review_date"];
	    }
	}
	export class KanbanCard {
	    id: string;
	    title: string;
	    columnId: string;
	
	    static createFrom(source: any = {}) {
	        return new KanbanCard(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.columnId = source["columnId"];
	    }
	}

}

