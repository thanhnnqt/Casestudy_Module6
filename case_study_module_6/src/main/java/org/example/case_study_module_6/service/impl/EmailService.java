package org.example.case_study_module_6.service.impl;

import jakarta.mail.internet.MimeMessage;
import org.example.case_study_module_6.entity.Booking;
import org.example.case_study_module_6.entity.Ticket;
import org.example.case_study_module_6.service.IEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService implements IEmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendVerificationEmail(String to, String link) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Xác nhận đăng ký tài khoản");
        message.setText(
                "Vui lòng click link để kích hoạt tài khoản:\n" + link
        );
        mailSender.send(message);
    }

    @Override
    public void send(String to, String subject, String content) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(to);
        mail.setSubject(subject);
        mail.setText(content);
        mailSender.send(mail);
    }

    @Override
    public void sendBookingSuccessEmail(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(booking.getContactEmail());
            helper.setSubject("Xác nhận đặt vé thành công - " + booking.getBookingCode());

            StringBuilder content = new StringBuilder();
            content.append("<html><body>");
            content.append("<h2>Cảm ơn bạn đã đặt vé tại hệ thống của chúng tôi!</h2>");
            content.append("<p>Mã đặt vé của bạn là: <strong>").append(booking.getBookingCode()).append("</strong></p>");
            content.append("<hr/>");
            
            // Chiều đi
            content.append("<h3>Thông tin chiều đi:</h3>");
            content.append("<p>Chuyến bay: ").append(booking.getFlight().getFlightNumber()).append("</p>");
            content.append("<p>Hãng hàng không: ").append(booking.getFlight().getAircraft().getAirline().getName()).append("</p>");
            content.append("<p>Khởi hành: ").append(booking.getFlight().getDepartureAirport().getCity())
                    .append(" (").append(booking.getFlight().getDepartureAirport().getCode()).append(")</p>");
            content.append("<p>Đến: ").append(booking.getFlight().getArrivalAirport().getCity())
                    .append(" (").append(booking.getFlight().getArrivalAirport().getCode()).append(")</p>");
            content.append("<p>Thời gian: ").append(booking.getFlight().getDepartureTime().format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy"))).append("</p>");

            // Chiều về (nếu có)
            if (booking.getReturnFlight() != null) {
                content.append("<hr/>");
                content.append("<h3>Thông tin chiều về:</h3>");
                content.append("<p>Chuyến bay: ").append(booking.getReturnFlight().getFlightNumber()).append("</p>");
                content.append("<p>Hãng hàng không: ").append(booking.getReturnFlight().getAircraft().getAirline().getName()).append("</p>");
                content.append("<p>Khởi hành: ").append(booking.getReturnFlight().getDepartureAirport().getCity())
                        .append(" (").append(booking.getReturnFlight().getDepartureAirport().getCode()).append(")</p>");
                content.append("<p>Đến: ").append(booking.getReturnFlight().getArrivalAirport().getCity())
                        .append(" (").append(booking.getReturnFlight().getArrivalAirport().getCode()).append(")</p>");
                content.append("<p>Thời gian: ").append(booking.getReturnFlight().getDepartureTime().format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy"))).append("</p>");
            }

            content.append("<hr/>");
            content.append("<h3>Danh sách hành khách và vé:</h3>");
            content.append("<table border='1' style='border-collapse: collapse; width: 100%;'>");
            content.append("<thead><tr style='background-color: #f2f2f2;'><th>Hành khách</th><th>Số vé</th><th>Số ghế</th><th>Hạng ghế</th><th>Giá vé</th></tr></thead>");
            content.append("<tbody>");
            for (Ticket ticket : booking.getTickets()) {
                content.append("<tr>");
                content.append("<td style='padding: 8px;'>").append(ticket.getPassengerName()).append("</td>");
                content.append("<td style='padding: 8px;'>").append(ticket.getTicketNumber()).append("</td>");
                content.append("<td style='padding: 8px;'>").append(ticket.getSeatNumber()).append("</td>");
                content.append("<td style='padding: 8px;'>").append(ticket.getSeatClass()).append("</td>");
                content.append("<td style='padding: 8px;'>").append(String.format("%,.0f VNĐ", ticket.getPrice())).append("</td>");
                content.append("</tr>");
            }
            content.append("</tbody></table>");

            content.append("<p><strong>Tổng cộng: ").append(String.format("%,.0f VNĐ", booking.getTotalAmount().doubleValue())).append("</strong></p>");
            content.append("<p>Chúc bạn có một chuyến bay tốt đẹp!</p>");
            content.append("</body></html>");

            helper.setText(content.toString(), true);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
