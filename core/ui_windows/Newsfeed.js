
class NewsfeedWindow extends Window {
    constructor(pSelector) {
        super(pSelector);

        // History of events
        this.events = [];

        // Active events this time increment
        this.currentNews = [];
    }

    /*
        Add a news item
            - pIsUrgent stops a time increment in its sub-pulse 
    */
    addNews(pTitle, pInfo, pDate, pCategory, pIsUrgent) {
        let newsObject = {
            title: pTitle,
            info: pInfo,
            date: pDate,
            category: pCategory,
            urgent: pIsUrgent,
            hasRead: false
        };
        this.events.push(newsObject);
        this.currentNews.push(newsObject);

        this.body.innerHTML += `<div class='ui-newsentry news-${pCategory}'>➤ [${pCategory.toUpperCase()}] ${pTitle}</div>`;

    }

    /*
        Clear the news feed and show the date
    */
    clearNews(pDate) {
        this.currentNews = [];

        this.body.innerHTML += `<div class='ui-newsdate'>🕒 ${Util.getStringDate(pDate)}</div>`;
    }
}