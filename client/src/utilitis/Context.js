import { createContext, useState } from "react";

export const ModalContext = createContext(null)
export const EditContext = createContext(null)
export const CommentContext = createContext(null)
export const SearchContext = createContext(null)
export const FollowContext = createContext(null)
export const ChatContext = createContext(null)
export const UserContext = createContext(null)
export const friendContext = createContext(null)


export const Modal = ({children}) =>{
    
    const [showmodal,setShowmodal]= useState(false)

    return(
        <ModalContext.Provider value={{showmodal,setShowmodal}}>
        {children}
        </ModalContext.Provider>
   )
}

export const EditModal = ({children}) =>{
    
    const [editmodal,setEditmodal]= useState(false)

    return(
        <EditContext.Provider value={{editmodal,setEditmodal}}>
        {children}
        </EditContext.Provider>
   )
}


export const CommentModal = ({children}) =>{
    
    const [showCommentmodal,setShowCommentmodal]= useState(false)
    
    return(
        <CommentContext.Provider value={{showCommentmodal,setShowCommentmodal}}>
        {children}
        </CommentContext.Provider>
   )
}

export const Searchmodal = ({children}) =>{
    
    const [searchmodal,setSearchmodal]= useState(false)

    return(
        <SearchContext.Provider value={{searchmodal,setSearchmodal}}>
        {children}
        </SearchContext.Provider>
   )
}

export const Followmodal = ({children}) =>{
    
    const [followmodal,setFollowmodal]= useState(false)

    return(
        <FollowContext.Provider value={{followmodal,setFollowmodal}}>
        {children}
        </FollowContext.Provider>
   )
}

export const User = ({children}) =>{
    const [usermodal,setusermodal]= useState({})
    
    return(
        <UserContext.Provider value={{usermodal,setusermodal}}>
        {children}
        </UserContext.Provider>
   )
}

export const Friend = ({children}) =>{
    const [friend,setFriend]= useState('')
    
    return(
        <friendContext.Provider value={{friend,setFriend}}>
        {children}
        </friendContext.Provider>
   )
}

export const ChatView = ({children}) =>{
    const [chat,setChat]= useState('')
    
    return(
        <ChatContext.Provider value={{chat,setChat}}>
        {children}
        </ChatContext.Provider>
   )
}
