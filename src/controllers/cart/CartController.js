const Course = require('../../models/Course');
const courseService = require('../../controllers/course/courseService');
const { multipleMongooseToObject } = require('../../utils/mongoose');
const User = require('../../models/User');

class CartController {
    // [GET] /cart
    async index(req, res, next) {
        const items = [];
        const cart = req.session.cart;
        let totalMoney = 0;
        let actualMoney = 0;

        for (const courseId of cart) {
            let course = await Course.findOne({ _id: courseId }).lean();
            course = await courseService.getInforCourse(course);
            items.push({
                ...course,
            });
        }

        items.forEach(item => {
            totalMoney += item.initialPrice;
            actualMoney += item.currentPrice;
        });

        res.render('vwCart/index.hbs', {
            items,
            empty: req.session.cart.length === 0,
            totalMoney,
            actualMoney,
            layout: false,
        });
    }

    // [POST] /cart/remove/:id
    remove(req, res) {
        const userId = req.session.authUser._id;
        const courseId = req.params.id;
        const cart = req.session.cart.filter(item => item != courseId);
        User.findByIdAndUpdate(userId, { cart: cart }).then(response => {
            req.session.cart = cart;
            res.redirect('back');
        });
    }

    // [POST] /cart/add/:id
    add(req, res) {
        const courseId = req.params.id;
        const userId = req.session.authUser._id;
        const cart = req.session.cart;

        cart.push(courseId);
        User.findByIdAndUpdate(userId, { cart: cart }).then(response => {
            req.session.cart = cart;
            res.redirect('back');
        });
    }

    // [POST] /cart/checkout
    checkout(req, res, next) {
        const userId = req.session.authUser._id;
        const registeredCourses = req.session.cart;
        console.log(registeredCourses);

        for(course of registeredCourses) {
            Course.findOne({ _id: course })
                .then(course1 => course1.students)
                .then(async students => {
                    students.push(userId);
                    await Course.findOneAndUpdate({ _id: course }, { students: students })
                });
        }

        User.findOne({ _id: userId })
            .then(user => user.courses)
            .then(courses => {
                registeredCourses.forEach(course => {
                    courses.push(course);
                    User.findOneAndUpdate(
                        { _id: userId },
                        { courses: courses, cart: [] },
                    ).then(() => {
                        req.session.cart = [];
                        res.redirect('back');
                    });
                });
            });
        // Thêm vào danh sách học viên
    }
}

module.exports = new CartController();
