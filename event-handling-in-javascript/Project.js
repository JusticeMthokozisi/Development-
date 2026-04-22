// Project.js

export default class Project {
    constructor(name, description, imageUrl, duration) {
      this.name = name;
      this.description = description;
      this.imageUrl = imageUrl;
      this.duration = duration;
    }
  
    getProjectDetails() {
      return {
        name: this.name,
        description: this.description,
        imageUrl: this.imageUrl,
        duration: this.duration,
      };
    }
  }
  