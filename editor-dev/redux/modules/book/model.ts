
import * as Type from './actionTypes';
import { Model, many, fk, attr, ORM } from 'redux-orm';
import {AnyModel} from 'redux-orm/Model'
import {ReducerModel, ReducerAction, ModelParse, ModelID} from '@/ormtype/model';

export class Book extends Model {

	static reducer(action: ReducerAction, Book: ReducerModel<Book>, session: any) {
		const { payload, type } = action;

		switch (type as Type.BookActionTypes) {
			// 교재 rawdata 받아 Model에 저장
			// 하위 모델들의 parse를 계속 따라가면서 호출하여 upsert를 수행하는 방식 
			case Type.BOOK_LOAD: {
				//load
				this.parse(payload);
				const book = this.getSelected();
				// console.log('##### payload', session.Book.all().toModelArray(), session.PageGroup.all().toRefArray())
				
				const firstPageGroup = book.sortedPageGroups.first();
				const firstPage = firstPageGroup.sortedPages.first();
				this.selectPageGroup(firstPageGroup.id);
				this.selectPage(firstPage.id);
				break;
			}
			//교재 생성
			case Type.BOOK_CREATE: {
				//@ts-ignore
				const { PageGroup, Page } = this.session;
				const page = Page.create({});
				const pageGroup = PageGroup.create({});
				//pageGroups에 페이지 추가
				pageGroup.pages.add(page);
				
				// book Model에 상태 추가
				const book = this.create({
				  info: payload.info,
				  canvasProperty: payload.canvasProperty,
				  selectedPageGroupId: pageGroup.id,
				  selectedPageId: page.id
				});
				console.log(book.pageGroups.add)
				//pageGroup에 pageGroup 추가
				book.pageGroups.add(pageGroup);
				break;
			}
			case Type.BOOK_UPDATE: {
				const book = this.getSelected();
				book.update({
				  info: payload.info,
				  canvasProperty: payload.canvasProperty
				});
				break;
			}
		}
	}

	static parse(data): ModelParse<AnyModel> {
		//@ts-ignore
		const { PageGroup } = this.session;// pageGroup 상태 추출
		const clonedData = { ...data }; // 데이터 deep copy

		//pageGroup parse 호출해 초기화
		clonedData.pageGroups = clonedData.pageGroups.map(pageGroup => {
			return PageGroup.parse(pageGroup)
		})

		console.log('clonedData', clonedData)
		return this.upsert(clonedData);
	}

	toJSON() {
		//@ts-ignore
		const { Page, Component, Asset } = this.getClass().session;
		return {
			...this.ref,
			pageCount: Page.count(),
			componentCount: Component.count(),
			assetCount: Asset.count(),
			// pageGroups: this.pageGroups.toModelArray().map(item => item.toJSON())
		};
	}

	static getSelected() {
		if (!this.idExists(0)) return null;

		return this.withId(0);
	}

	static getSelectedPageGroupId(): ModelID | null {
		if (!this.idExists(0)) return null;

		return this.withId(0).selectedPageGroupId;
	}

	static selectPageGroup(id: ModelID): void {
		if (!this.idExists(0)) return;

		const book = this.withId(0);
		book.set('selectedPageGroupId', id);
	}

	static getSelectedPageId(): ModelID | null {
		if (!this.idExists(0)) return null;

		return this.withId(0).selectedPageId;
	}

	static selectPage(id: ModelID): void {
		if (!this.idExists(0)) return;

		const book = this.withId(0);
		book.set('selectedPageId', id);
	}

	static getSelectedEventGroupId(): ModelID | null {
		if (!this.idExists(0)) return null;

		return this.withId(0).selectedEventGroupId;
	}

	static selectEventGroup(id: ModelID): void {
		if (!this.idExists(0)) return;

		const book = this.withId(0);
		book.set('selectedEventGroupId', id);
	}

	static info() {
		return this.getSelected().info;
	}

	get sortedPageGroups() {
		//@ts-ignore
		const pageGroups = this.getClass().session.PageGroup.all()
		
		return pageGroups.orderBy('zIndex');
	}
}

Book.modelName = 'Book';


Book.fields = {
	id: attr(),
	canvasProperty: attr(),
	info: attr(),
	lastUpdate: attr(),
	selectedPageGroupId: attr(), // selected pagegroup
	selectedPageId: attr(), // selected page
	selectedEventGroupId: attr(), //selected eventgroup
	pageGroups: many('PageGroup')
};

//@ts-ignore
Book.defaultProps = {
	selectedPageGroupId: 0,
	selectedPageId: 0,
	selectedEventGroupId: null,
	pageGroups: []
};

export default Book;
