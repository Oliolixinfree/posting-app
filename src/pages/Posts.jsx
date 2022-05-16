// import React, { useState, useEffect } from 'react';
// import PostService from '../API/PostSevice';
// import { useFetching } from '../hooks/useFetching';
// import { usePosts } from '../hooks/usePosts';
// import { getPageCount } from '../utils/pages';


// import PostFilter from '../components/PostFilter';
// import PostForm from '../components/PostForm';
// import PostList from '../components/PostList';
// import MyButton from '../components/UI/button/MyButton';
// import { Loader } from '../components/UI/Loader/Loader';
// import MyModal from '../components/UI/MyModal/MyModal';
// import Pagination from '../components/UI/pagination/pagination';

import React, {useEffect, useRef, useState} from 'react';
import PostService from "../API/PostService";
import {usePosts} from "../hooks/usePosts";
import {useFetching} from "../hooks/useFetching";
import {getPageCount} from "../utils/pages";
import MyButton from "../components/UI/button/MyButton";
import PostForm from "../components/PostForm";
import MyModal from "../components/UI/MyModal/MyModal";
import PostFilter from "../components/PostFilter";
import PostList from "../components/PostList";
import Loader from "../components/UI/Loader/Loader";
import Pagination from "../components/UI/pagination/Pagination";
import { useObserver } from '../hooks/useObserver';
import MySelect from '../components/UI/select/MySelect';

function Posts() {
	// деструкторизация
	// const [value, setValue] = useState('текст в инпуте') //пример
	const [posts, setPosts] = useState([
    // {id: 1, title: 'JavaScript', body: 'Junior'},
    // {id: 2, title: 'C++', body: 'Nightmare'},
    // {id: 3, title: 'Python', body: 'Beginer'},
    // {id: 4, title: 'Rust', body: 'IDK'},
    
	])

	const [filter, setFilter] = useState({sort: '', query: ''})
	const [modal, setModal] = useState(false)
	const sortedAndSearchPosts = usePosts(posts, filter.sort, filter.query)
	const [totalPages, setTotalPages] = useState(0)
	const [limit, setLimit] = useState(10)
	const [page, setPage] = useState(1)
	const lastElement = useRef()

	const [fetchPosts, isPostsLoading, postError] = useFetching(async(limit, page) => {
		const response = await PostService.getAll(limit, page)	
		setPosts([...posts, ...response.data])
		const totalCount = response.headers['x-total-count']
		setTotalPages(getPageCount(totalCount, limit))
	})

	useObserver(lastElement, page < totalPages, isPostsLoading, () => {
		setPage(page +1)
	})

	useEffect(() => {
        fetchPosts(limit, page)
    }, [page, limit])


	{/*Неуправляемый/Неконтролируемый компонент

    const bodyInputRef = useRef() // Получаем доступ к дом элементу и забираем его значение
    <MyInput 
	ref={bodyInputRef}
	type={'text'} 
	placeholder='Описание поста' 
/>
  */}

	const createPost = (newPost) => {
		setPosts([...posts, newPost])
		setModal(false)
	}



  // Получаем post из дочернего компонента
	const removePost = (post) => {
		setPosts(posts.filter(p => p.id !== post.id))
	}

	const changePage = (page) => {
		setPage(page)
		
	}


	return (
	<div className="App">
		<MyButton style={{marginTop: '30px'}} onClick={() => setModal(true)}>
			Создать пост
		</MyButton>
		<MyModal visible={modal} setVisible={setModal}>
		<PostForm create={createPost} />
		</MyModal>
		<hr style={{margin: '15px 0', backgroundColor: 'teal', height: '3px'}} />
		<PostFilter
			filter={filter} 
			setFilter={setFilter} 
		/>
		<MySelect
			value={limit}
			onChange={value => setLimit(value)}
			defaultValue='Количиство элементов на странице'
			options={[
				{value: 5, name: '5'},
				{value: 10, name: '10'},
				{value: 25, name: '25'},
				{value: -1, name: 'Показать все'}
			]}
		/>
		{postError &&
			<h1>Произошла ошибка ${postError}</h1>
		}
		<PostList remove={removePost} posts={sortedAndSearchPosts} title='Посты про JS' />
		<div ref={lastElement} style={{height: 20, background: 'red'}} />
		{isPostsLoading &&
			<div style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}><Loader /></div>
		}
		<Pagination
			page={page} 
			changePage={changePage} 
			totalPages={totalPages} 
		/>
	</div>
	);
}

export default Posts;