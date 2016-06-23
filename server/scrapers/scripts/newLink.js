
function newLink(list,links){
  list.forEach(item=>{
    if (!(/gfycat/.test(item.data.domain)) && !(/streamable/.test(item.data.domain)) && !(/youtu/.test(item.data.domain))) {
      var post = {
        title: item.data.title,
        link: item.data.url,
        author: 'n/a',
        count: 0,
        source: 'REDDIT',
        comments: 'http://www.reddit.com' + item.data.permalink,
        num_comments: item.data.num_comments,
        score: item.data.score
      };
      links.push(post);
    }
  });
  return links;

}

module.exports=newLink;
