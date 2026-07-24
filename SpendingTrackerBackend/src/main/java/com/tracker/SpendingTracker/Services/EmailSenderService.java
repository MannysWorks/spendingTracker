package com.tracker.SpendingTracker.Services;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailSenderService {

  private final JavaMailSender mailSender;
  private static final Logger logger = LoggerFactory.getLogger(EmailSenderService.class);

  public void sendEmail(String toEmail, String Subject, String body) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom("emmanueldizulu@gmail.com");
    message.setTo(toEmail);
    message.setText(body);

    mailSender.send(message);
    logger.info("Mail sent successfully...");
  }
}
