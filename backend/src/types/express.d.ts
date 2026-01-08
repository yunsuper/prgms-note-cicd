declare global {
    namespace Express {
        interface Request {
            user?: any; // 나중에 User 모델 타입으로 변경
            note?: any; // 나중에 Note 모델 타입으로 변경
        }
    }
}
