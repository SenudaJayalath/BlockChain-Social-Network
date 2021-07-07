import React,{Component} from 'react'


class Main extends Component {

    handleTip(_id){
        this.props.tip(_id)
        //console.log(_id)
    }

    render() {
        return(
            <>
            <form onSubmit={(event)=>{
                event.preventDefault()
                const content=this.postContent.value
                this.props.postContent(content)
            }}>
                <div className="form-group mr-sm-2">
                    <input 
                        id="postContent"
                        type="text"
                        ref={(input)=>{this.postContent =input}}
                        className="form-control"
                        placeholder="What's on your mind?"
                        required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Share</button>

            </form>


            { this.props.posts.map((post,key)=>{
            return (
                <div className="card mb-3" key={key}>
                    <div className="card-header">
                    {post.author}
                    </div>
                    <div className="card-body">
                        {/* <h5 className="card-title">Author :{post.author}</h5> */}
                        <p className="card-text">{post.content}</p>
                        <button href="#" className="btn btn-primary float-right" onClick={()=>this.handleTip(post.id)}>Tip 0.1 Eth</button>
                        <small className="float-left mt-1 text-muted">
                            Tips: {window.web3.utils.fromWei(post.tipAmount.toString())} ETH
                        </small>
                    </div>
            </div>
            )
    })} </>
        )
    }
}

export default Main;