class CommentBox extends React.Component{

    //1-1.show comments if state is true
	constructor(){
		super();

		this.state = {
			showComments:false,
			//load comments from remote server
			comments:[]
		/* 5-1 moved from _getComponent
		 	comments:  [
		 	{id:1,author:'Morgan Mc',body:'i'm in component.js'},
		 	{id:2,author:'Bob BB',body:'i'm in component.js 2222'}
		 ]
		 */
		};
	}

	//6-2 call _fetchComments on the mounting(means 1st time) phase
	componentWillMount(){
		this._fetchComments();
	}

	render(){
		const comments = this._getComments();

		// //1-2show comments if state is true
		// let commentNodes;
		// if (this.state.showComments){
		// 	commentNodes = <div className="comment-list">{comments}</div>
		// }


		// //2-3 handle click event-button text based on state
		// let buttonText = 'Show comments';

		// if(this.state.showComments){
		// 	buttonText = 'Hide comment';
		// }

		return(
		 	//1-3show comments if state is true
		 	//4-1 using commentForm to add Comments
			<div className="comment-box"		 
				// 	{commentNodes}
				//2-1handle click event
			//<button onClick={this._handleCliick.bind(this)}>{buttonText}</button>
				<CommentForm addComment={this._addComment.bind(this)} />
				<CommentAvatarList avatars={this._getAvatars()} />
		        {this._getPopularMessage(comments.length)}
		        <h3 className="comment-count">{this._getCommentsTitle(comments.length)}</h3>
		        <div className="comment-list">
		          {comments}
		        </div>
			</div>
			);
	}

  _getAvatars() {
    return this.state.comments.map(comment => comment.avatarUrl);
  }

  _getPopularMessage(commentCount) {
    const POPULAR_COUNT = 10;
    if (commentCount > POPULAR_COUNT) {
       return (
         <div>This post is getting really popular, don't miss out!</div>
       );
    }
  }

 //    5-2 rendering comments from the state
	// 8-3 pass a delete callback prop to comment
	_getComments(){
		return this.state.comments.map((comment) =>{
			return(<Comment 
			 		id={comment.id}
               		author={comment.author}
               		body={comment.body}
               		avatarUrl={comment.avatarUrl}
               		onDelete={this._deleteComment.bind(this)}
               		key={comment.id} />);
		});
	}

	_getCommentsTitle(commentCount){
		if(commentCount === 0){
			return 'No comments yet';
		}else if (commentCount === 1){
		    return '1 comment';
		}else{
			return `${commentCount} comments`;
		}
	}


	//4-2 using commentForm to add Comments
	_addComment(commentAuthor, commentBody){
		const comment = {
			id: Math.floor(Math.random() * (9999 - this.state.comments.length + 1)) + this.state.comments.length,
      		author: commentAuthor,
      		body: commentBody,
      		avatarUrl: 'images/default-avatar.png'
    };

		//jQuery.post('/api/comments',{comment})
			  //.success(newComment => {
			  	this.setState({comments: this.state.comments.concat([newComment])});
			  //});
	}

	//6-1fetch data in component
	_fetchComments(){
	    $.ajax({
	      method: 'GET',
	      url: 'comments.json',
	      success: (comments) => {
	        this.setState({ comments });
	      }
		});
	}

	_deleteComment(commentID) {
	    const comments = this.state.comments.filter(
	      comment => comment.id !== commentID
	    );
	    
	    this.setState({ comments });
	  }
	}
		//8-1delete from api
	// _deleteComment(comment){
	// 	jQuery.ajax({
	// 		method:'DELETE',
	// 		url:`/api/comments/${comment.id}`
	// 	});

	// 	const comments=[...this.state.comments];
	// 	const commentIndex = comments.indexOf(comment);
	// 	comments.splice(commentIndex,1);
	// 	this.setState({comments});
	// }

	//7-1 check whether poll(means data updates on server side) data on the mounting phase
// 	componentDidMount(){
// 		this._timer=setInterval(()=>this._fetchComments(),5000);
// 	}

// 	//7-2 prevent memory leaks
// 	componentWillUnmount(){
// 		clearInterval(this._timer);
// 	}


// 	//2-2 handle click event
// 	_handleClick(){
// 		this.setState({
// 			showComments: !this.state.showComments
// 		});
// 	}
// }

class CommentForm extends React.Component{
	constructor() {
	    super();
	    this.state = {
	      characters: 0
	    };
  }

	render(){
		return(
			 //add eventListener to form
			 // access data from handle
			<form className="comment-form" onSubmit={this._handleSubmit.bind(this)}>
				<label>Join the discussion</label>
				<div className="comment-form-fields">
					<input placeholder="Name:" ref={(input) =>this._author = input} />
					<textarea placeholder="Comments:" ref={(textarea) => this._body= textarea}></textarea>
				</div>
				 <p>{this.state.characters} characters</p>
				<div className="comment-form-actions">
					<button type="submit">
						Post Comment
					</button>
				</div>
			</form>

		);
	}

	// _handleSubmit(event){
	// 	event.preventDefault();

	// 	let author = this._author;
	// 	let body = this._body;

	// 	this.props.addComment(author.value,body.value);

  _getCharacterCount(e) {
    this.setState({
      characters: this._body.value.length
    });
  }
  
  _handleSubmit(event) {
    event.preventDefault();
            
    if (!this._author.value || !this._body.value) {
      alert('Please enter your name and comment.');
      return;
    }

    this.props.addComment(this._author.value, this._body.value);
    
    this._author.value = '';
    this._body.value = '';
    
    this.setState({ characters: 0  });
	}
}

class CommentAvatarList extends React.Component {
  render() {
    const { avatars = [] } = this.props;
    return (
      <div className="comment-avatars">
        <h4>Authors</h4>
        <ul>
          {avatars.map((avatarUrl, i) => (
            <li key={i}>
              <img src={avatarUrl} />
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

//class Comment extends React.Component{
// 	render(){
// 		return(
// 			<div className="comment">
// 				<p className="comment-header">{this.props.author}</p>
// 				<p className="comment-body">{this.props.body}</p>
// 				<div className="comment-footer">
// 					<a href="#" className="comment-footer-delete">DELETE COMMENT</a>
// 				</div>
// 				<a href="#" onClick={this._handleDelete.bind(this)}>Delete comment</a>
// 			</div>
// 			);
// 	}

// 	_handleDelete(e){
// 		e.preventDefault();
// 		if(confirm('are u sure?')){
// 			this.props.onDelete(this.props.comment);
// 		}	
// 	}
// }

class Comment extends React.Component {
  constructor() {
    super();

    this.state = {
      isAbusive: false
    };
  }

  render() {
    let commentBody;
    if (!this.state.isAbusive) {
      commentBody = this.props.body;
    } else {
      commentBody = <em>Content marked as abusive</em>;
    }
    return(
      <div className="comment">
        
        <img src={this.props.avatarUrl} alt={`${this.props.author}'s picture`} />

        <p className="comment-header">{this.props.author}</p>
        <p className="comment-body">{commentBody}</p>

        <div className="comment-actions">
          <RemoveCommentConfirmation onDelete={this._handleDelete.bind(this)} />
          <a href="#" onClick={this._toggleAbuse.bind(this)}>Report as Abuse</a>
        </div>
      </div>
    );
  }

  _toggleAbuse(event) {
    event.preventDefault();

    this.setState({
      isAbusive: !this.state.isAbusive
    });
  }
  
  _handleDelete() {
    this.props.onDelete(this.props.id);
  }
}


class RemoveCommentConfirmation extends React.Component {
  constructor() {
    super();
    
    this.state = {
      showConfirm: false
    };
  }
  
  render() {
    let confirmNode;
    if (this.state.showConfirm) {
      return (
        <span>
          <a href="" onClick={this._confirmDelete.bind(this)}>Yes </a> - or - <a href="" onClick={this._toggleConfirmMessage.bind(this)}> No</a>
        </span>
      );
    } else {
      confirmNode = <a href="" onClick={this._toggleConfirmMessage.bind(this)}>Delete comment?</a>;
    }
    return (
      <span>{confirmNode}</span>
    );
  }
  
  _toggleConfirmMessage(e) {
    e.preventDefault();
    
    this.setState({
      showConfirm: !this.state.showConfirm
    });
  }
  
  _confirmDelete(e) {
    e.preventDefault();
    this.props.onDelete();
  }
}

jQuery(function() {
  ReactDOM.render(
    <CommentBox />,
    document.getElementById('comment-box')
  );
})

