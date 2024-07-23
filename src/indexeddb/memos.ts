import Dexie from 'dexie'

export interface MemoRecord {
    datetime: string
    title: string
    text: string
}

const database = new Dexie('markdown-editor')
database.version(1).stores({ memos: '&datetime' }) //インデックスにするデータ名
const memos: Dexie.Table<MemoRecord, string> = database.table('memos')

export const putMemo = async (title: string, text: string): Promise<void> => {
    const datetime = new Date().toISOString() // 日時を生成する処理
    await memos.put({ datetime, title, text }) // dbに保存する処理
}

const NUM_PER_PAGE: number = 10

export const getMemoPageCount = async (): Promise<number> => {
const totalCount = await memos.count()
const pageCount = Math.ceil(totalCount / NUM_PER_PAGE)
return pageCount > 0 ? pageCount : 1
}

// IndexedDBから履歴をリストで取得する処理
export const getMemos = (page: number): Promise<MemoRecord[]> => {
    const offset = (page - 1) * NUM_PER_PAGE
    return memos.orderBy('datetime')
                .reverse()
                .offset(offset)
                .limit(NUM_PER_PAGE)
                .toArray()
}